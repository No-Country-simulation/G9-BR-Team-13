"""
Script de ingestao de dados reais da Wikipedia para enriquecer o dataset de treinamento.

Utiliza a API de consulta da Wikipedia em portugues (pt.wikipedia.org) para buscar
artigos de diversas areas do conhecimento (tecnologia, saude, direito, financas, etc.),
extrair seus resumos e estrutura-los no mesmo formato CSV esperado pelo pipeline
de treinamento (titulo, texto, categoria).

Diferente do script generate_realistic_dataset.py que cria dados sinteticos,
este script obtem dados reais e variados, melhorando a capacidade de generalizacao
do modelo para diferentes dominios.

Estrategia de API:
    1. Para cada termo de busca em cada categoria, usa action=query + list=search
       para obter os titulos dos artigos.
    2. Para cada lote de titulos (ate 50), usa action=query + titles=A|B|C + prop=extracts
       para obter os resumos de multiplos artigos em uma unica chamada.
    Isso reduz o numero de requisicoes HTTP drasticamente.

Wikipedia API Reference:
    - Busca: https://pt.wikipedia.org/w/api.php?action=query&list=search&...
    - Extrato: https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&...
"""

import csv
import os
import random
import re
import time
import urllib.parse
import urllib.request
import json


# Mapeamento de categorias para termos de busca na Wikipedia em portugues.
# Cada categoria possui uma lista de palavras-chave que serao usadas para
# encontrar artigos relevantes na enciclopedia.
# Foram selecionados termos amplos e bem estabelecidos em cada area.
CATEGORY_SEARCH_TERMS = {
    "Backend": [
        "Programacao de computadores", "Servidor web", "Framework",
        "API", "Linguagem de programacao", "Java", "Python",
        "Banco de dados", "Arquitetura de software", "Orientacao a objetos",
        "Microsservicos", "REST", "Mensageria", "Autenticacao", "Criptografia",
    ],
    "Dados": [
        "Ciencia de dados", "Banco de dados", "SQL",
        "Aprendizado de maquina", "Inteligencia artificial", "Estatistica",
        "Big data", "Mineracao de dados", "Visualizacao de dados",
        "Redes neurais", "Processamento de linguagem natural",
        "Analise de dados", "Probabilidade",
    ],
    "DevOps": [
        "DevOps", "Computacao em nuvem", "Docker", "Kubernetes",
        "Infraestrutura", "Linux", "Rede de computadores",
        "Seguranca da informacao", "AWS", "Automacao",
        "Virtualizacao", "Monitoramento", "Git", "Container", "Sistema operacional",
    ],
    "Frontend": [
        "Front-end", "HTML", "CSS", "JavaScript",
        "TypeScript", "React", "Design web",
        "Interface do usuario", "Acessibilidade web",
        "Navegador web", "SPA", "Web design responsivo",
    ],
    "Saude": [
        "Medicina", "Cardiologia", "Pediatria", "Enfermagem",
        "Farmacologia", "Anatomia", "Fisiologia", "Vacina",
        "Cirurgia", "Epidemiologia", "Biologia", "Genetica",
        "Neurologia", "Psiquiatria", "Nutricao",
    ],
    "Direito": [
        "Direito", "Legislacao", "Constituicao",
        "Direito civil", "Direito penal", "Direito trabalhista",
        "Direito tributario", "Tribunal", "Advocacia", "Lei",
        "Direitos humanos", "Contrato", "Regulamentacao",
    ],
    "Financas": [
        "Economia", "Contabilidade", "Mercado financeiro",
        "Investimento", "Banco", "Microeconomia", "Macroeconomia",
        "Bolsa de valores", "Inflacao", "Juros", "Credito",
        "Orcamento", "Capital", "Gestao financeira",
    ],
    "Marketing": [
        "Marketing", "Publicidade", "Vendas", "Marca",
        "Midia digital", "Comportamento do consumidor", "Propaganda",
        "SEO", "Midias sociais", "Branding", "E-commerce",
        "Comunicacao social", "Marketing digital",
    ],
    "Educacao": [
        "Educacao", "Pedagogia", "Ensino", "Aprendizagem",
        "Didatica", "Curriculo escolar", "Educacao infantil",
        "Ensino superior", "Educacao a distancia",
        "Tecnologia educacional", "Alfabetizacao", "Avaliacao educacional",
    ],
    "Outros": [
        "Geografia", "Historia", "Filosofia", "Sociologia",
        "Antropologia", "Politica", "Arte", "Musica", "Cinema",
        "Literatura", "Esporte", "Meio ambiente", "Astronomia",
        "Fisica", "Quimica", "Engenharia", "Psicologia",
    ],
}

# User-Agent obrigatorio pela politica de uso da Wikipedia
CABECALHO_USER_AGENT = "TechKnowledgeML/1.0 (projeto academico; contato: dev@techknowledge.com)"


def _requisicao_api(params):
    """
    Executa uma requisicao a API action=query da Wikipedia e retorna o JSON.

    Args:
        params (dict): Parametros da query string para a API.

    Returns:
        Optional[dict]: Resposta JSON decodificada, ou None em caso de erro.
    """
    params["format"] = "json"
    url = "https://pt.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url)
    req.add_header("User-Agent", CABECALHO_USER_AGENT)
    req.add_header("Accept", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"  [AVISO] Erro na requisicao: {e}")
        return None


def buscar_titulos_por_termo(consulta, limite=10):
    """
    Busca titulos de artigos na Wikipedia em portugues para um termo.

    Args:
        consulta (str): Termo de busca.
        limite (int, optional): Maximo de resultados. Padrao e 10.

    Returns:
        List[str]: Lista de titulos de artigos encontrados.
    """
    dados = _requisicao_api({
        "action": "query",
        "list": "search",
        "srsearch": consulta,
        "srlimit": limite,
        "utf8": 1,
    })
    if not dados:
        return []
    resultados = dados.get("query", {}).get("search", [])
    return [item["title"] for item in resultados]


def obter_extratos_em_lote(titulos):
    """
    Obtem os extratos (resumos introdutorios) de multiplos artigos em uma unica chamada.

    Usa prop=extracts com exintro=1 e explaintext=1 para obter apenas o paragrafo
    inicial de cada artigo, sem HTML, em formato texto puro.

    Args:
        titulos (List[str]): Lista de titulos de artigos.

    Returns:
        Dict[str, str]: Mapeamento de titulo do artigo para seu texto de resumo.
    """
    if not titulos:
        return {}

    dados = _requisicao_api({
        "action": "query",
        "titles": "|".join(titulos),
        "prop": "extracts",
        "exintro": 1,
        "explaintext": 1,
        "utf8": 1,
    })
    if not dados:
        return {}

    paginas = dados.get("query", {}).get("pages", {})
    resultado = {}
    for page_id, pagina in paginas.items():
        if page_id == "-1":
            continue
        titulo = pagina.get("title", "")
        extract = pagina.get("extract", "").strip()
        if extract and len(extract) >= 50:
            resultado[titulo] = extract
    return resultado


def extrair_titulo_curto(texto):
    """
    Extrai um titulo curto a partir do inicio do texto do artigo.

    Usa a primeira frase do texto ou as primeiras 6 palavras como titulo,
    limitado a 60 caracteres. Util para gerar o campo 'titulo' do CSV.

    Args:
        texto (str): Texto completo do artigo.

    Returns:
        str: Titulo curto extraido com no maximo 60 caracteres.
    """
    match = re.match(r'^["""]?(.+?)[.!?]', texto)
    if match:
        titulo_extraido = match.group(1).strip()[:60]
        if len(titulo_extraido) > 10:
            return titulo_extraido

    words = texto.split()
    titulo = " ".join(words[:6])
    return titulo[:60]


def extrair_titulo_curto(texto):
    """
    Extrai um titulo curto a partir do inicio do texto do artigo.

    Usa a primeira frase do texto ou as primeiras 6 palavras como titulo,
    limitado a 60 caracteres. Util para gerar o campo 'titulo' do CSV.

    Args:
        texto (str): Texto completo do artigo.

    Returns:
        str: Titulo curto extraido com no maximo 60 caracteres.
    """
    match = re.match(r'^["""]?(.+?)[.!?]', texto)
    if match:
        titulo_extraido = match.group(1).strip()[:60]
        if len(titulo_extraido) > 10:
            return titulo_extraido

    words = texto.split()
    titulo = " ".join(words[:6])
    return titulo[:60]


def gerar_dataset_wikipedia(artigos_por_categoria=30):
    """
    Gera um dataset completo com dados reais obtidos da Wikipedia.

    Estrategia de coleta:
        1. Para cada categoria, percorre os termos de busca definidos.
        2. Para cada termo, busca ate 10 titulos de artigos na Wikipedia.
        3. Coleta todos os titulos unicos encontrados em todos os termos da categoria.
        4. Obtem os extratos de todos os titulos em LOTE (ate 50 por chamada API),
           reduzindo drasticamente o numero de requisicoes HTTP.
        5. Para cada artigo, gera variacoes de comprimento de texto (curto, medio, longo)
           para melhorar a robustez do modelo.

    Args:
        artigos_por_categoria (int, optional): Numero maximo de artigos
            a coletar por categoria. Padrao e 30.

    Returns:
        List[Dict[str, str]]: Lista de dicionarios com 'titulo', 'texto' e 'categoria'.
    """
    random.seed(42)
    linhas = []

    for categoria, termos in CATEGORY_SEARCH_TERMS.items():
        print(f"\n[INFO] Processando categoria: {categoria}")
        titulos_coletados = set()

        # Fase 1: Coletar todos os titulos unicos de todos os termos de busca
        for termo in termos:
            if len(titulos_coletados) >= artigos_por_categoria:
                break
            resultados = buscar_titulos_por_termo(termo, limite=8)
            for titulo in resultados:
                if len(titulos_coletados) < artigos_por_categoria:
                    titulos_coletados.add(titulo)

        if not titulos_coletados:
            print(f"  [AVISO] Nenhum artigo encontrado para {categoria}")
            continue

        # Fase 2: Obter extratos em lote (uma unica requisicao para todos os titulos)
        print(f"  Buscando extratos de {len(titulos_coletados)} artigos em lote...")
        extratos = obter_extratos_em_lote(list(titulos_coletados))
        print(f"  Obtidos extratos de {len(extratos)} artigos com sucesso")

        # Fase 3: Gerar linhas do CSV com variacoes de comprimento
        for titulo_artigo, texto in extratos.items():
            titulo_csv = extrair_titulo_curto(texto)

            # Versao completa (texto original)
            linhas.append({
                "titulo": titulo_csv,
                "texto": texto,
                "categoria": categoria,
            })

            # Versao reduzida (primeira metade do texto)
            words = texto.split()
            if len(words) > 30:
                texto_curto = " ".join(words[: len(words) // 2])
                linhas.append({
                    "titulo": titulo_csv,
                    "texto": texto_curto,
                    "categoria": categoria,
                })

            # Versao estendida com frase de contextualizacao
            frase_contexto = random.choice([
                "Este conceito e amplamente utilizado e fundamental para profissionais da area.",
                "Compreender bem este assunto e essencial para quem atua ou estuda nesta area.",
                "Este tema continua relevante e se mantem como base para estudos avancados.",
                "Dominar este conhecimento diferencia profissionais em qualquer segmento do mercado.",
            ])
            linhas.append({
                "titulo": titulo_csv,
                "texto": f"{texto} {frase_contexto}",
                "categoria": categoria,
            })

        artigos_count = len(extratos)
        linhas_count = artigos_count * 3
        print(f"  [OK] {categoria}: {artigos_count} artigos, {linhas_count} linhas geradas")

    random.shuffle(linhas)
    return linhas


def gerar_para_csv(artigos_por_categoria=30, nome_arquivo="dataset.csv"):
    """
    Gera o dataset enriquecido com dados da Wikipedia e persiste em CSV.

    Args:
        artigos_por_categoria (int, optional): Quantidade de artigos por categoria.
            Padrao e 30.
        nome_arquivo (str, optional): Nome do arquivo CSV de saida.
            Padrao e 'dataset.csv'.

    Returns:
        str: Caminho completo do arquivo CSV gerado.
    """
    print("=" * 70)
    print("  INGESTAO DE DADOS DA WIKIPEDIA")
    print("  Enriquece o dataset com artigos reais de 10 categorias")
    print("=" * 70)
    print(f"\nCategorias: {list(CATEGORY_SEARCH_TERMS.keys())}")
    print(f"Artigos por categoria: ~{artigos_por_categoria}")
    print(f"(cada artigo gera ~3 variacoes de texto)\n")

    dataset = gerar_dataset_wikipedia(artigos_por_categoria)

    if not dataset:
        print("\n[ERRO] Nenhum dado foi coletado. Verifique sua conexao com a internet.")
        return None

    os.makedirs("data", exist_ok=True)
    caminho = f"data/{nome_arquivo}"
    with open(caminho, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["titulo", "texto", "categoria"])
        writer.writeheader()
        writer.writerows(dataset)

    # Estatisticas do dataset gerado
    from collections import Counter
    contagem = Counter(item["categoria"] for item in dataset)

    print(f"\n{'=' * 70}")
    print(f"  DATASET GERADO COM SUCESSO!")
    print(f"  Arquivo: {caminho}")
    print(f"  Total de exemplos: {len(dataset)}")
    print(f"{'=' * 70}")
    print(f"\nDistribuicao por categoria:")
    for cat, qtd in sorted(contagem.items()):
        print(f"  {cat}: {qtd} exemplos")
    print(f"\nComprimento medio dos textos: ~{sum(len(item['texto']) for item in dataset) // len(dataset)} caracteres")
    print(f"[OK] Dataset salvo em '{caminho}'")

    return caminho


if __name__ == "__main__":
    gerar_para_csv(artigos_por_categoria=30)
