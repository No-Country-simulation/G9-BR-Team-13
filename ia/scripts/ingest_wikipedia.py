"""
Script de ingestao de dados reais da Wikipedia para enriquecer o dataset de treinamento.

Utiliza a API de consulta da Wikipedia em portugues (pt.wikipedia.org) para buscar
artigos de temas exclusivamente de tecnologia, extrair seus resumos e estrutura-los
no formato CSV esperado pelo pipeline de treinamento (titulo, texto, categoria).

Este script obtem dados reais e variados, melhorando a capacidade de generalizacao
do modelo para diferentes dominios tech.

Estrategia de API:
    1. Para cada termo de busca em cada categoria, usa action=query + list=search
       para obter os titulos dos artigos.
    2. Para cada lote de titulos (ate 50), usa action=query + titles=A|B|C + prop=extracts
       para obter os resumos de multiplos artigos em uma unica chamada.
    Isso reduz o numero de requisicoes HTTP drasticamente.

Filtros anti-alucinacao:
    - Filtro de namespace (srnamespace=0): apenas artigos principais, sem paginas de discussao, usuario, etc.
    - Filtro de categorias Wikipedia: cada artigo precisa ter ao menos uma categoria tech (prop=categories)
    - Filtro textual: o conteudo precisa conter vocabulario tecnico minimo
    - Termos de busca especificos: evitando ambiguidades com linguagem comum

Wikipedia API Reference:
    - Busca: https://pt.wikipedia.org/w/api.php?action=query&list=search&...
    - Categorias: https://pt.wikipedia.org/w/api.php?action=query&prop=categories&...
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


# Categorias tech da Wikipedia que indicam que um artigo e relevante para tecnologia.
# Um artigo precisa ter PELO MENOS UMA dessas categorias para ser aceito no dataset.
TECH_CATEGORIES_WHITELIST = {
    "Ciencia da computacao", "Ciencia da computação",
    "Engenharia de software",
    "Programacao", "Programação",
    "Linguagens de programacao", "Linguagens de programação",
    "Sistemas operacionais",
    "Banco de dados",
    "Redes de computadores",
    "Seguranca computacional", "Segurança computacional",
    "Seguranca da informacao", "Segurança da informação",
    "Inteligencia artificial",
    "Aprendizado de maquina", "Aprendizado de máquina",
    "Ciencia de dados", "Ciência de dados",
    "Engenharia da computacao", "Engenharia da computação",
    "Tecnologia da informacao", "Tecnologia da informação",
    "Desenvolvimento web",
    "Desenvolvimento mobile",
    "Computacao grafica", "Computação gráfica",
    "Software",
    "Hardware",
    "Internet",
    "World Wide Web",
    "Computacao em nuvem", "Computação em nuvem",
    "Criptografia",
    "Blockchain",
    "Criptomoedas",
    "DevOps",
    "Teste de software",
    "Qualidade de software",
    "Arquitetura de software",
    "Padroes de projeto", "Padrões de projeto",
    "Framework",
    "API",
    "Protocolos de internet",
    "Servidores",
    "Compiladores",
    "Algoritmos",
    "Estruturas de dados",
    "Sistemas distribuidos", "Sistemas distribuídos",
    "Computacao movel", "Computação móvel",
    "Interface do usuario", "Interface do usuário",
    "Design de interacao", "Design de interação",
    "Experiencia do usuario", "Experiência do usuário",
    "Acessibilidade web",
    "UX",
    "UI",
    "Front-end",
    "Back-end",
    "Full stack",
    "Machine learning",
    "Deep learning",
    "Processamento de linguagem natural",
    "Visao computacional", "Visão computacional",
    "Robotica", "Robótica",
    "Automacao", "Automação",
    "Internet das coisas",
    "Big data",
    "DevSecOps",
    "Metodologias ageis", "Metodologias ágeis",
    "Gerenciamento de projetos de software",
    "Controle de versao", "Controle de versão",
    "Computacao em nuvem", "Computação em nuvem",
    "Virtualizacao", "Virtualização",
    "Containers",
    "Microsservicos", "Microsserviços",
    "Arquitetura de redes",
    "Ciencia da informacao", "Ciência da informação",
    "Sistemas de informacao", "Sistemas de informação",
    "Computacao", "Computação",
    "Informatica", "Informática",
    "Tecnologia",
    "Engenharia de sistemas",
    "Analise de sistemas", "Análise de sistemas",
    "Desenvolvimento de software",
    "Programacao orientada a objetos", "Programação orientada a objetos",
    "Paradigmas de programacao", "Paradigmas de programação",
    "Dados",
    "Banco NoSQL",
    "Banco de dados relacionais",
    "SQL",
    "ETL",
    "Pipeline de dados",
    "Data lake",
    "Data warehouse",
    "Cloud computing",
    "Computacao de borda", "Computação de borda",
    "Infraestrutura como codigo", "Infraestrutura como código",
    "IaC",
    "Terraform",
    "Docker",
    "Kubernetes",
    "Linux",
    "Seguranca digital", "Segurança digital",
    "Ciberguerra",
    "Ciberseguranca", "Cibersegurança",
    "Hacker",
    "Engenharia social (seguranca)", "Engenharia social (segurança)",
    "LGPD",
    "Blockchain",
    "Contrato inteligente",
    "Web3",
    "DeFi",
    "Cadeia de blocos",
    "Selenium (software)",
    "Playwright (software)",
    "Cypress (software)",
    "TDD",
    "BDD",
    "Dart (linguagem de programacao)", "Dart (linguagem de programação)",
    "Flutter",
    "React (biblioteca)",
    "Angular (framework)",
    "Vue (framework)",
    "Node.js",
    "TypeScript",
    "Swift (linguagem de programacao)", "Swift (linguagem de programação)",
    "Kotlin (linguagem de programacao)", "Kotlin (linguagem de programação)",
    "Java (linguagem de programacao)", "Java (linguagem de programação)",
    "Python (linguagem de programacao)", "Python (linguagem de programação)",
    "JavaScript (linguagem de programacao)", "JavaScript (linguagem de programação)",
    "Rust (linguagem de programacao)", "Rust (linguagem de programação)",
    "Go (linguagem de programacao)", "Go (linguagem de programação)",
    "C Sharp",
    "C (linguagem de programacao)", "C (linguagem de programação)",
    "C++",
    "PHP (linguagem de programacao)", "PHP (linguagem de programação)",
    "Ruby (linguagem de programacao)", "Ruby (linguagem de programação)",
}

# Padroes de titulos que indicam artigo NAO-tech (musica, geografia, esportes, etc.)
NON_TECH_TITLE_PATTERNS = [
    r'\bbanda\b', r'\bmusica\b', r'\bmúsica\b', r'\bálbum\b', r'\balbum\b',
    r'\bcantor\b', r'\bcantora\b', r'\bguitarra\b', r'\bvocalista\b',
    r'\bdisco\b.*\bmusical\b', r'\bsingle\b', r'\bshow\b',
    r'\bfilme\b', r'\bserie\b', r'\bsérie\b', r'\bdocumentario\b',
    r'\bator\b', r'\batriz\b', r'\bdiretor\b.*\bcinema\b',
    r'\besporte\b', r'\bfutebol\b', r'\bbasquete\b', r'\bcorrida\b',
    r'\bciclismo\b', r'\bFormula\s*1\b', r'\bcampeonato\b',
    r'\bilha\b', r'\bpaís\b', r'\bmunicipio\b', r'\bmunicípio\b',
    r'\bcidade\b', r'\bcapital\b.*\bestado\b', r'\bregiao\b',
    r'\bguerra\b', r'\bbatalha\b', r'\bimperio\b', r'\bimpério\b',
    r'\brei\b', r'\bprincipe\b', r'\bpríncipe\b',
    r'\bmedicina\b', r'\bdoenca\b', r'\bdoença\b',
    r'\bhospital\b', r'\bdoente\b', r'\bpaciente\b',
    r'\benvenenamento\b', r'\bsuicidio\b', r'\bsuicídio\b',
    r'\bassassinato\b', r'\bmorte\b',
    r'\bradio\b', r'\brádio\b', r'\btelevisao\b', r'\btelevisão\b',
    r'\bnovela\b', r'\bprograma.*\bTV\b', r'\bemissora\b',
    r'\bescola\b.*\bsamba\b', r'\bcarnaval\b',
    r'\bgastronomia\b', r'\breceita\b.*\bculinaria\b',
    r'\bpraia\b', r'\bturismo\b', r'\bhoteis\b', r'\bhotéis\b',
    r'\bcassino\b', r'\bjogo.*\bazar\b',
    r'\bcrise\b.*\beconomica\b',
    r'\bpolicia\b', r'\bpolicia\b', r'\bcrime\b',
    r'\bavião\b', r'\baviao\b', r'\bombardeio\b', r'\bexplosão\b',
]

# Vocabulario tecnico minimo: o texto precisa conter ao menos N termos deste conjunto
TECH_VOCABULARY = {
    'software', 'programa', 'programação', 'codigo', 'código', 'algoritmo',
    'dados', 'sistema', 'servidor', 'computador', 'computacao', 'computação',
    'rede', 'internet', 'web', 'aplicacao', 'aplicação', 'aplicativo',
    'usuario', 'usuário', 'interface', 'banco de dados', 'linguagem',
    'programar', 'desenvolvedor', 'desenvolvimento', 'framework',
    'biblioteca', 'funcao', 'função', 'variavel', 'variável', 'classe',
    'objeto', 'metodo', 'método', 'compilador', 'interpretador',
    'depuracao', 'depuração', 'teste', 'deploy', 'versao', 'versão',
    'commit', 'branch', 'servico', 'serviço', 'api', 'rest', 'http',
    'protocolo', 'tcp', 'ip', 'dns', 'nuvem', 'cloud',
    'container', 'docker', 'kubernetes', 'virtualizacao', 'virtualização',
    'maquina virtual', 'máquina virtual', 'linux', 'windows', 'macos',
    'android', 'ios', 'mobile', 'smartphone',
    'inteligencia artificial', 'inteligência artificial', 'machine learning',
    'aprendizado de maquina', 'aprendizado de máquina', 'redes neurais',
    'deep learning', 'processamento de linguagem natural', 'nlp',
    'big data', 'data science', 'ciencia de dados', 'ciência de dados',
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle',
    'criptografia', 'segurança', 'seguranca', 'autenticacao', 'autenticação',
    'firewall', 'malware', 'phishing', 'hacker',
    'blockchain', 'bitcoin', 'ethereum', 'criptomoeda', 'contrato inteligente',
    'frontend', 'front-end', 'backend', 'back-end', 'fullstack',
    'html', 'css', 'javascript', 'typescript', 'react', 'angular', 'vue',
    'node', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
    'flutter', 'react native', 'dart',
    'git', 'github', 'ci/cd', 'devops', 'infraestrutura',
    'monitoramento', 'log', 'metricas', 'métricas',
    'qualidade', 'tdd', 'bdd', 'teste unitario', 'teste de integracao',
    'selenium', 'cypress', 'playwright',
    'agil', 'scrum', 'kanban', 'metodologia agil',
    'ux', 'ui', 'usabilidade', 'design thinking', 'protótipo', 'prototipo',
    'arquitetura', 'microsservicos', 'microsserviços', 'soa',
    'escalabilidade', 'performance', 'otimizacao', 'otimização',
    'memoria', 'memória', 'processador', 'cpu', 'gpu', 'armazenamento',
    'thread', 'concorrencia', 'concorrência', 'assincrono', 'assíncrono',
    'compilacao', 'compilação', 'linkagem',
    'certificado digital', 'tls', 'ssl', 'ssh', 'vpn',
    'orm', 'jpa', 'hibernate', 'sqlalchemy',
    'grafo', 'arvore', 'árvore', 'fila', 'pilha', 'lista', 'hash',
    'recursao', 'recursão', 'iteracao', 'iteração',
    'ide', 'editor de texto', 'terminal', 'linha de comando', 'cli',
}


# Mapeamento de categorias tech para termos de busca na Wikipedia em portugues.
# Cada categoria possui uma lista de palavras-chave que serao usadas para
# encontrar artigos relevantes na enciclopedia.
# Foram selecionados termos especificos para evitar ambiguidades com linguagem comum.
CATEGORY_SEARCH_TERMS = {
    "Backend": [
        "Programacao de computadores", "Servidor web", "Framework (software)",
        "API", "Linguagem de programacao", "Java (linguagem de programacao)",
        "Python (linguagem de programacao)",
        "Banco de dados", "Arquitetura de software", "Orientacao a objetos",
        "Microsservicos", "REST (informatica)", "Mensageria (informatica)",
        "Autenticacao (computacao)", "Criptografia (informatica)",
        "Compilador", "Software livre", "Teste de software (informatica)",
        "Interface de programacao", "Protocolo de rede",
        "Thread (computacao)", "Thread",
        "Maquina virtual", "Container (software)", "Algoritmo (computacao)",
        "Estrutura de dados", "Depuracao (programacao)",
        "Log (informatica)", "ORM (programacao)", "API REST",
        "Back-end", "Programacao Funcional",
    ],
    "Dados": [
        "Ciencia de dados", "Banco de dados", "SQL",
        "Aprendizado de maquina", "Inteligencia artificial", "Estatistica",
        "Big data", "Mineracao de dados", "Visualizacao de dados",
        "Redes neurais", "Processamento de linguagem natural",
        "Analise de dados", "Probabilidade (estatistica)",
        "Regressao linear", "Classificacao (aprendizado de maquina)",
        "Clusterizacao", "Serie temporal", "Amostragem (estatistica)",
        "Correlacao (estatistica)",
        "Banco de dados relacional", "Banco NoSQL", "Dado estruturado",
        "Pipeline de dados", "ETL", "Data mining",
        "Analise de regressao",
    ],
    "DevOps": [
        "DevOps", "Computacao em nuvem", "Docker (software)", "Kubernetes",
        "Infraestrutura (tecnologia)", "Linux", "Rede de computadores",
        "Seguranca da informacao", "AWS (nuvem)", "Automacao (tecnologia)",
        "Virtualizacao (informatica)", "Monitoramento (redes)",
        "Git (software)", "Container (software)",
        "Sistema operacional",
        "Proxy (redes)", "Firewall (informatica)", "DNS",
        "CLI", "Linguagem de script", "Pipeline (computacao)",
        "LAN", "Criptografia (informatica)", "Certificado digital",
        "Backup (informatica)", "LDAP",
        "Infraestrutura como codigo", "Terraform (software)",
        "Ansible", "CI/CD",
    ],
    "Frontend": [
        "Front-end (programacao)", "HTML", "CSS", "JavaScript",
        "TypeScript", "React (biblioteca)", "Web design",
        "Interface do usuario", "Acessibilidade web",
        "Navegador web", "Single-page application",
        "Web design responsivo",
        "UX (design)", "Tipografia (web)", "Animacao web",
        "Framewok CSS", "JavaScript assincrono", "DOM (programacao)",
        "Evento (computacao)", "Formulario web", "SVG", "Canvas (HTML)",
        "Angular (framework)", "Vue (framework)", "Sass (linguagem de estilo)",
        "Bootstrap (framework)",
    ],
    "Mobile": [
        "Desenvolvimento mobile", "Android (sistema operacional)", "iOS",
        "Flutter (software)", "React Native",
        "Aplicativo movel", "Swift (linguagem de programacao)",
        "Kotlin (linguagem de programacao)",
        "Smartphone", "Desenvolvimento de aplicativos",
        "Interface de usuario movel",
        "Xamarin", "Framework mobile",
        "Aplicacao movel hibrida",
        "Android Studio", "App (aplicativo movel)",
    ],
    "Ciberseguranca": [
        "Seguranca da informacao", "Criptografia (informatica)",
        "Firewall (informatica)", "Hacker (seguranca)",
        "Lei Geral de Protecao de Dados Pessoais",
        "Ciberseguranca", "Seguranca digital", "Malware",
        "Phishing", "Seguranca de rede",
        "Engenharia social (seguranca)", "Ransomware",
        "Teste de penetracao (computacao)",
        "Autenticacao (computacao)", "Biometria (computacao)",
        "Seguranca computacional", "Vulnerabilidade (computacao)",
        "Criptografia de chave publica", "Criptografia de curva eliptica",
        "TLS (protocolo)", "Assinatura digital",
    ],
    "Cloud/Infra": [
        "Computacao em nuvem", "Servidor (informatica)", "Datacenter",
        "AWS (nuvem)", "Azure (nuvem)", "Google Cloud Platform",
        "Infraestrutura (tecnologia)",
        "Virtualizacao (informatica)", "Cloud computing",
        "IaaS", "PaaS", "SaaS",
        "Edge computing",
        "Infraestrutura como codigo", "Terraform (software)",
        "Escalabilidade (computacao)",
        "Computacao de borda",
        "Servidor dedicado", "Servidor virtual",
        "Rede de entrega de conteudo", "CDN",
    ],
    "QA": [
        "Teste de software (informatica)", "Qualidade de software",
        "Test-driven development", "Desenvolvimento orientado a testes",
        "Automacao de testes", "Teste unitario", "Teste de integracao",
        "Selenium (software)", "Cypress (software)", "Playwright (software)",
        "Teste de regressao", "Teste de aceitacao",
        "Behavior-driven development",
        "Teste de desempenho (software)", "Teste funcional (software)",
        "Teste de caixa branca", "Teste de caixa preta",
        "Integracao continua (software)",
    ],
    "Blockchain": [
        "Blockchain", "Criptomoeda", "Bitcoin", "Ethereum",
        "Smart contract", "Web3", "DeFi", "Cadeia de blocos",
        "Token (blockchain)", "NFT (token)", "Contrato inteligente",
        "Criptografia (informatica)", "Livro razao distribuido",
        "Consenso distribuido (blockchain)",
        "Criptomoeda (tecnologia)",
        "Prova de trabalho", "Prova de participacao",
        "Carteira de criptomoedas",
    ],
    "UX/UI": [
        "Design de interface", "Experiencia do usuario", "Figma (software)",
        "Usabilidade (design)", "Design thinking",
        "Interface do usuario",
        "UX (design)", "UI design", "Prototipacao (design)",
        "Design centrado no usuario", "Arquitetura da informacao",
        "Design system", "Teste de usabilidade", "Wireframe (design)",
        "Design de interacao", "Ciencia cognitiva (design)",
        "Heuristicas de usabilidade",
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


def _artigo_tem_categoria_tech(titulo):
    """
    Verifica se um artigo da Wikipedia possui ao menos uma categoria tech.

    Consulta prop=categories da API e checa se alguma categoria corresponde
    a whitelist de categorias de tecnologia.

    Args:
        titulo (str): Titulo do artigo na Wikipedia.

    Returns:
        bool: True se o artigo tiver pelo menos uma categoria tech.
    """
    dados = _requisicao_api({
        "action": "query",
        "titles": titulo,
        "prop": "categories",
        "cllimit": "max",
        "utf8": 1,
    })
    if not dados:
        return False

    paginas = dados.get("query", {}).get("pages", {})
    for page_id, pagina in paginas.items():
        if page_id == "-1":
            continue
        categorias = pagina.get("categories", [])
        for cat in categorias:
            nome_cat = cat.get("title", "")
            # Remove prefixo "Categoria:" para comparar
            nome_sem_prefixo = nome_cat.replace("Categoria:", "", 1)
            if nome_sem_prefixo in TECH_CATEGORIES_WHITELIST:
                return True
    return False


def _texto_eh_tech(texto):
    """
    Verifica heuristicamente se o texto de um artigo e sobre tecnologia.

    Conta quantos termos do vocabulario tech aparecem no texto.
    O texto precisa ter pelo menos 3 termos tech para ser considerado relevante.

    Args:
        texto (str): Texto do artigo.

    Returns:
        bool: True se o texto parecer ser sobre tecnologia.
    """
    if not texto:
        return False
    texto_lower = texto.lower()
    contagem = sum(1 for termo in TECH_VOCABULARY if termo in texto_lower)
    return contagem >= 3


def _titulo_nao_eh_tech(titulo):
    """
    Verifica se o titulo do artigo corresponde a padroes nao-tech.

    Args:
        titulo (str): Titulo do artigo.

    Returns:
        bool: True se o titulo parecer nao ser tech.
    """
    titulo_lower = titulo.lower()
    for pattern in NON_TECH_TITLE_PATTERNS:
        if re.search(pattern, titulo_lower):
            return True
    return False


def buscar_titulos_por_termo(consulta, limite=10):
    """
    Busca titulos de artigos na Wikipedia em portugues para um termo.

    Inclui filtro de namespace (srnamespace=0) para buscar apenas no
    espaco principal de artigos, excluindo paginas de discussao, usuario, etc.

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
        "srnamespace": 0,
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


def gerar_dataset_wikipedia(artigos_por_categoria=50):
    """
    Gera um dataset completo com dados reais obtidos da Wikipedia.

    Estrategia de coleta:
        1. Para cada categoria, percorre os termos de busca definidos.
        2. Para cada termo, busca ate 10 titulos de artigos na Wikipedia.
        3. Coleta todos os titulos unicos encontrados em todos os termos da categoria.
        4. Filtra artigos por:
           a. Categoria Wikipedia (prop=categories) - precisa ter ao menos uma categoria tech
           b. Conteudo textual - precisa conter vocabulario tech minimo
           c. Titulo - rejeita padroes obviamente nao-tech
        5. Obtem os extratos de todos os titulos em LOTE (ate 50 por chamada API),
           reduzindo drasticamente o numero de requisicoes HTTP.
        6. Para cada artigo, gera variacoes de comprimento de texto (curto, medio, longo)
           para melhorar a robustez do modelo.

    Args:
        artigos_por_categoria (int, optional): Numero maximo de artigos
            a coletar por categoria. Padrao e 50.

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
            resultados = buscar_titulos_por_termo(termo, limite=15)
            for titulo in resultados:
                if len(titulos_coletados) < artigos_por_categoria:
                    # Filtro rapido por titulo (evita chamadas de API desnecessarias)
                    if not _titulo_nao_eh_tech(titulo):
                        titulos_coletados.add(titulo)

        if not titulos_coletados:
            print(f"  [AVISO] Nenhum artigo encontrado para {categoria}")
            continue

        print(f"  {len(titulos_coletados)} titulos coletados (pre-filtro)")

        # Fase 1.5: Filtrar por categorias Wikipedia (prop=categories)
        # So fazemos isso se tivermos mais artigos que o necessario
        titulos_filtrados = set()
        for titulo in titulos_coletados:
            if len(titulos_filtrados) >= artigos_por_categoria:
                break
            if _artigo_tem_categoria_tech(titulo):
                titulos_filtrados.add(titulo)

        if not titulos_filtrados:
            print(f"  [AVISO] Nenhum artigo com categoria tech para {categoria}")
            continue

        descarte_cat = len(titulos_coletados) - len(titulos_filtrados)
        if descarte_cat > 0:
            print(f"  {descarte_cat} artigos descartados por categoria nao-tech")

        # Fase 2: Obter extratos em lotes de 20 (API da Wikipedia limita retorno)
        print(f"  Buscando extratos de {len(titulos_filtrados)} artigos em lotes de 20...")
        extratos = {}
        lista_titulos = list(titulos_filtrados)
        for i in range(0, len(lista_titulos), 20):
            lote = lista_titulos[i:i + 20]
            resultado_lote = obter_extratos_em_lote(lote)
            extratos.update(resultado_lote)
            print(f"    Lote {i // 20 + 1}: +{len(resultado_lote)} extratos")
        print(f"  Total: {len(extratos)} extratos obtidos")

        # Fase 2.5: Filtrar extratos por vocabulario tech
        extratos_filtrados = {}
        for titulo_artigo, texto in extratos.items():
            if _texto_eh_tech(texto):
                extratos_filtrados[titulo_artigo] = texto

        descarte_texto = len(extratos) - len(extratos_filtrados)
        if descarte_texto > 0:
            print(f"  {descarte_texto} artigos descartados por conteudo nao-tech")

        if not extratos_filtrados:
            print(f"  [AVISO] Nenhum artigo tech valido para {categoria}")
            continue

        # Fase 3: Gerar linhas do CSV com variacoes de comprimento
        for titulo_artigo, texto in extratos_filtrados.items():
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

        artigos_count = len(extratos_filtrados)
        linhas_count = artigos_count * 3
        print(f"  [OK] {categoria}: {artigos_count} artigos validos, {linhas_count} linhas geradas")

    random.shuffle(linhas)
    return linhas


def gerar_para_csv(artigos_por_categoria=50, nome_arquivo="dataset.csv"):
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
    print("  Filtros ativos: namespace=0, categorias tech, vocabulario tech")
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
    gerar_para_csv(artigos_por_categoria=50)
