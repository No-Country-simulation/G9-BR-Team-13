# Documentação Oficial do Projeto

**Hackathon ONE — Alura + Oracle | Grupo G9 | Time 13**

## Organização Inteligente de Conteúdo Técnico com Ciência de Dados

Versão 1.0 · Product Owner: Você · Equipe: 8 pessoas

> Nota: este arquivo nasceu como transcrição em Markdown da documentação oficial do projeto (originalmente um PDF). Desde então, o projeto foi concluído — as seções que descreviam planos ("o time vai...", "a recomendação é...") foram atualizadas para refletir o que foi de fato construído e decidido ao longo da execução; onde o raciocínio da decisão original ainda é útil, ele foi preservado com uma nota indicando o resultado final.

---

## 1. Sumário Executivo

Este documento é a fonte única de verdade do projeto do Time 13 para o Hackathon ONE (Alura + Oracle, trilha G9). Ele consolida a análise do edital, a arquitetura escolhida, a divisão da equipe, o backlog completo, o cronograma de sprints, os padrões técnicos e o roteiro de apresentação. Qualquer pessoa da equipe deve conseguir assumir sua parte do projeto lendo apenas este material.

**Objetivo do produto:** construir uma solução que recebe conteúdo técnico (título + texto) e devolve, via API REST, a categoria temática do conteúdo, a probabilidade da classificação e palavras-chave/informações adicionais, em formato JSON.

**Critério de sucesso nº 1:** entregar 100% do MVP obrigatório do edital, funcionando de ponta a ponta e hospedado na OCI, com documentação e demo impecáveis.

**Critério de sucesso nº 2:** manter a arquitetura simples o suficiente para uma equipe júnior concluir em 5 semanas, sem abrir mão de organização e qualidade de código.

**Decisão central de arquitetura:** um serviço de Backend em Java/Spring Boot expõe a API pública (nome final do produto: **TechMind**), valida e trata erros, delega a inferência a um serviço interno de Machine Learning em Python/FastAPI (que carrega o modelo TF-IDF + Regressão Logística) e, após obter a classificação, persiste o resultado em um banco PostgreSQL hospedado na própria instância OCI Compute. Essa separação espelha exatamente os dois papéis técnicos que a equipe já possui (Tech Lead Java/Spring e Tech Lead Python/Data Science), reduz o acoplamento e permite que as duas frentes trabalhem em paralelo desde a Semana 1. Detalhe de implementação sobre o artefato do modelo (`.joblib`): ver seção 16.1.

As seções seguintes detalham cada decisão, sempre explicando o motivo técnico e priorizando o que maximiza a nota e a chance de vitória em um hackathon de curta duração.

---

## 2. Análise do Edital

### 2.1 Domínio do problema

O edital (trilha "Educação / Tecnologia / Produtividade") pede uma solução de organização inteligente de conteúdo técnico: o sistema recebe textos técnicos (artigos, documentação, anotações, cursos, tutoriais) e usa Ciência de Dados para extrair informação relevante — classificação temática, palavras-chave, agrupamento, recomendação ou organização automática de base de conhecimento. O resultado deve ser um JSON consumível por outras aplicações, com integração obrigatória a pelo menos um serviço OCI.

### 2.2 Requisitos obrigatórios (o que garante nota)

| Requisito obrigatório do edital | Como o time entrega |
|---|---|
| Endpoint `POST /conteudo` que recebe título+texto e devolve categoria, probabilidade e informações adicionais | Backend Spring Boot expõe o endpoint; FastAPI executa a inferência |
| Notebook de Ciência de Dados (EDA, limpeza, TF-IDF, treino, métricas, serialização) | Notebook único em `ia/notebooks`, versionado no repositório |
| API REST com validação de entrada e tratamento de erros | Bean Validation (Jakarta) no Spring Boot + handler global de exceções |
| Integração com pelo menos um serviço OCI | Object Storage para o artefato do modelo (`.joblib`) — obrigatório e o mais simples de garantir |
| README com instruções, uso da API, exemplos e dependências | README único na raiz do monorepo, estrutura detalhada na seção 17 |
| Demonstração funcional explicando como o modelo gera os resultados | Roteiro de Demo Day detalhado na seção 18 |
| Mínimo de três exemplos de uso da API | Três exemplos fixos cobrindo 3 categorias diferentes, incluídos no README e usados na demo |

### 2.3 Recursos opcionais (o que aumenta a nota sem colocar o MVP em risco)

O edital lista como opcionais: busca por palavra-chave, processamento em lote via CSV, dashboard simples, persistência de resultados, Docker, testes automatizados, explicabilidade do modelo e busca semântica (ver seção 21 — Melhorias Futuras para os que ficam de fora). Dentre eles, o time decidiu antecipar dois para o MVP por serem baratos de implementar e por já fazerem parte da arquitetura oficial sugerida: persistência de resultados (seção 15) e busca por palavra-chave (Épico 2, Feature 2.3), ambos reaproveitando peças que o time já vai construir de qualquer forma (banco de dados e vetorizador TF-IDF).

### 2.4 Interpretação do exemplo de contrato do edital

```
POST /conteudo
Request:
{
  "titulo": "Introdução ao Spring Boot",
  "texto": "Neste conteúdo são apresentados os conceitos..."
}

Response 200:
{
  "categoria": "Backend",
  "probabilidade": 0.89,
  "informacoes_adicionais": ["Java", "Spring Boot", "API REST"]
}
```

O edital deixa explícito que "a estrutura final da resposta poderá variar de acordo com a abordagem escolhida". O time adota este contrato como baseline e o estende (seção 14) apenas com campos que não quebram compatibilidade, evitando qualquer risco de fugir do que foi pedido.

---

## 3. Arquitetura da Solução

### 3.1 Arquitetura oficial sugerida pela organização

A organização do hackathon compartilhou o diagrama de referência: Frontend (React/Vue) → REST API (Spring Boot) → Serviço de IA (Flask/FastAPI) → modelo TF-IDF + Regressão Logística carregado do OCI Object Storage, com um Banco de Dados (Oracle/MySQL) desenhado no caminho principal.

Essa sugestão foi avaliada com a equipe. O time decidiu manter o banco de dados no fluxo, por ser útil para o histórico de classificações e para os recursos opcionais de consulta/busca do edital — mas substituindo o Oracle Autonomous Database por um banco relacional open-source, rodando como container Docker na mesma instância OCI Compute que hospeda o Backend e o serviço de IA. A integração obrigatória com OCI continua garantida por dois serviços nativos da Oracle Cloud: Object Storage (artefato do modelo) e Compute (hospedagem de toda a aplicação, incluindo o banco) — o requisito do edital é "pelo menos um serviço OCI", e nada exige que o banco de dados em si seja um serviço Oracle.

A única mudança em relação ao diagrama oficial é a ordem das chamadas: em vez de escrever no banco antes e depois de chamar o serviço de IA (como sugere a seta de retorno do diagrama), o Backend grava apenas uma vez, já com o resultado final da classificação em mãos. Isso elimina o risco de registro incompleto e mantém a escrita em banco fora do caminho crítico da resposta — se o banco falhar, a API ainda responde a classificação ao usuário (escrita "melhor esforço", com log do erro).

**PostgreSQL, decisão final:** entre PostgreSQL e MySQL (ambos cogitados originalmente), o time seguiu com **PostgreSQL 16** — suporte de primeira classe no Spring Boot (driver e dialect do Hibernate maduros), imagem Docker oficial leve e tipos de dado mais expressivos para texto longo (TEXT nativo).

### 3.2 Opções avaliadas

**Opção A — Monólito único em Python (FastAPI)**
- Prós: menor superfície de integração; um único deploy; ideal para times pequenos e prazo curto
- Contras: não aproveita o Tech Lead Java/Spring do time; menos aderente a times que querem mostrar dois stacks
- Risco: baixo

**Opção B — Dois serviços: Spring Boot (API pública) + FastAPI (inferência interna)**
- Prós: espelha exatamente os dois papéis técnicos do time (Java e Python); Backend fica livre para evoluir validação, banco e regras de negócio sem tocar no modelo; Ciência de Dados entrega e evolui o modelo isoladamente
- Contras: duas aplicações para subir na OCI; precisa de um contrato interno HTTP estável entre os dois serviços
- Risco: médio — mitigado com contrato fixo definido na Semana 1 e mock (Opção A como fallback), ver Plano B na seção 20

**Opção C — Microsserviços completos (gateway, service discovery, mensageria)**
- Prós: escalabilidade teórica alta
- Contras: complexidade totalmente desnecessária para o MVP e para 5 semanas com equipe júnior; risco altíssimo de não terminar
- Decisão: descartada — viola a diretriz do edital e do briefing de "não usar microsserviços desnecessários"

### 3.3 Arquitetura escolhida: Opção B

A Opção B é a ideal para um hackathon de poucas semanas com uma equipe de níveis técnicos heterogêneos porque: (1) permite paralelismo real — Backend e Dados trabalham simultaneamente a partir de um contrato combinado na Semana 1, sem bloquear um ao outro; (2) mantém cada serviço simples e testável isoladamente; (3) usa exatamente as tecnologias que o edital sugere (Java para API, Python/Scikit-Learn para o modelo) sem inventar complexidade adicional; (4) o fallback para monólito único (Opção A) é trivial caso a integração HTTP entre os dois serviços atrase — o time pode embutir a lógica de inferência diretamente no FastAPI e o Spring Boot chamar como proxy simples.

### 3.4 Diagrama de arquitetura (fluxo completo)

```
┌──────────────┐   HTTPS    ┌───────────────────────┐
│   Frontend    │ ─────────► │   Backend API (Java)  │
│ React (TechMind)│◄───────── │      Spring Boot       │
└──────────────┘    JSON     │ - Validação de entrada │
                              │ - Tratamento de erros  │
                              │ - Regras de negócio     │
                              └──────────┬─────────────┘
                                         │ HTTP interno
                                         │ POST /predict
                                         ▼
                              ┌───────────────────────┐
                              │   ML Service (Python)  │
                              │       FastAPI            │
                              │ - Carrega modelo         │
                              │   (joblib) em memória    │
                              │ - TF-IDF + LogReg         │
                              │ - Extrai keywords          │
                              │   e explicabilidade         │
                              └──────────┬─────────────┘
                                         │ lê artefato na subida
                                         ▼
                              ┌───────────────────────────────┐
                              │ modelo.joblib / vectorizer.joblib │
                              │ (versionados no repositório;      │
                              │  publicados também no OCI Object   │
                              │  Storage como backup, ver 16.1)     │
                              └───────────────────────────────┘

Após receber a classificação, o Backend grava o resultado final (uma única vez):

  Backend API (Java) ──────► ┌───────────────────────┐
   grava resultado final      │      PostgreSQL 16      │
   (best-effort, fora do       │  container Docker na   │
    caminho crítico)            │  mesma VM OCI Compute  │
                                └───────────────────────┘
```

### 3.5 Explicação do fluxo

1. O usuário envia título e texto pelo Frontend (React), que faz uma chamada HTTPS ao Backend.
2. O Spring Boot valida a entrada (campos obrigatórios, tamanho mínimo/máximo de texto) antes de qualquer processamento.
3. O Spring Boot chama internamente o serviço FastAPI, que já carregou o modelo (`.joblib`) e o vetorizador TF-IDF na memória no momento em que o serviço subiu.
4. O serviço de IA executa a predição, gera a probabilidade, extrai as palavras mais relevantes e o peso de explicabilidade de cada termo (coeficientes da Regressão Logística × TF-IDF do texto), devolvendo um JSON ao Backend.
5. O Spring Boot formata a resposta final no contrato do edital e persiste o registro (título, texto, categoria, probabilidade, palavras-chave, explicabilidade) no banco PostgreSQL — em modo melhor-esforço, sem bloquear a resposta caso o banco falhe.
6. A resposta é devolvida ao Frontend imediatamente após a classificação, sem esperar a confirmação da escrita em banco.
7. O artefato do modelo treinado (`.joblib`) é versionado no próprio repositório Git e reconstruído na imagem Docker do serviço de IA a cada deploy — é esse arquivo que o serviço realmente carrega em produção hoje. O upload para o OCI Object Storage (script `ia/scripts/upload_to_oci.py`) também é feito a cada retreinamento, cumprindo o requisito obrigatório de integração OCI como artefato publicado/versionado — mas o `model_loader.py` só efetivamente baixa do bucket quando o arquivo não está presente localmente (cenário de disaster recovery ou de uma instância nova sem o repositório). Ver seção 16.1 para o detalhe completo desse fluxo e por que ele é assim.
8. Backend, serviço de IA e o container do banco de dados rodam na mesma instância OCI Compute (Free Tier) — essa é a integração OCI que efetivamente sustenta a aplicação em produção.

---

## 4. Stack Tecnológica

Cada tecnologia foi escolhida por reduzir risco e curva de aprendizado para uma equipe júnior, e por estar alinhada às "Ferramentas Esperadas" citadas no próprio edital (Python, Java).

| Camada | Tecnologia escolhida | Motivo técnico |
|---|---|---|
| Frontend | React 19 + React Router + Vite + Tailwind CSS + Lucide React | Setup rápido (Vite), Tailwind acelerou a estilização das 5 telas (Analisar, Dashboard, Base de Conhecimento, Histórico, Configurações); time já viu React na formação |
| Backend API | Java 17 + Spring Boot 3.5 (Web, Validation, Data JPA) | Robusto para validação/tratamento de erro; citado explicitamente no edital como exemplo (Spring Boot) |
| Serviço de ML | Python 3.11 + FastAPI + Scikit-Learn | FastAPI gera validação e docs automáticas (Swagger) com pouquíssimo código; Scikit-Learn é o sugerido pelo edital |
| Vetorização/Modelo | TF-IDF (`TfidfVectorizer`) + Regressão Logística | Sugestão direta do edital; leve, rápido de treinar, interpretável — dataset final cresceu bem além do mínimo (ver seção 13) |
| Serialização do modelo | `joblib` | Citado no edital; padrão para objetos Scikit-Learn, mais eficiente que pickle puro para arrays NumPy |
| Banco de dados | PostgreSQL 16 em container Docker na OCI Compute | Open-source, sem custo, integração madura com Spring Data JPA; escolhido no lugar do Oracle Autonomous DB por simplicidade de operação dentro da mesma VM |
| Cloud | OCI Object Storage (obrigatório) + OCI Compute (hospedagem) | Menor caminho para cumprir a integração obrigatória com OCI; Compute simples com `VM.Standard.E2.1.Micro` (always-free) |
| Deploy | Docker Compose para os 4 serviços (Postgres, backend, ML, frontend/Nginx) | O plano original previa Compose como opcional só para o banco — na prática o time containerizou tudo (ver seção 21, item já entregue), com scripts próprios em `scripts/` (dev/prod/test/build/clean) e HTTPS via Let's Encrypt em produção |
| Documentação | Markdown (READMEs por área) + Swagger/OpenAPI automático do FastAPI e springdoc-openapi no Spring | Gera parte da documentação da API automaticamente, economizando tempo do time |
| Testes | JUnit 5 + Mockito (Backend) + Pytest (ML Service) | Cobertura foi além dos endpoints críticos: inclui testes de mapper (serialização/desserialização), de service (ciclo completo com mocks) e de integração HTTP contra um stub server |
| Versionamento | Git + GitHub | Já definido pela plataforma do hackathon (ver print de "Links do Projeto") |

**Tecnologias deliberadamente evitadas:** Kubernetes, mensageria (Kafka/RabbitMQ), microsserviços adicionais, bancos NoSQL, frameworks de frontend mais pesados (Next.js/Angular) e qualquer LLM/embeddings — todos aumentam risco sem aumentar nota no MVP.

---

## 5. Estrutura de Repositórios

Monorepo único (mais simples de gerenciar por uma equipe júnior e por evitar sincronizar múltiplos repositórios com pouco tempo disponível). Estrutura final, como o projeto foi de fato construído:

```
G9-BR-Team-13/
├── frontend/
│   ├── src/
│   │   ├── components/    # AnalysisForm, ResultCard, ContentModal, JsonViewer, Sidebar, Header, StatusCards...
│   │   ├── pages/          # Analysis (tela inicial), Dashboard, Library (Base de Conhecimento), History, Settings
│   │   ├── layouts/         # MainLayout
│   │   ├── services/        # api.js (chamadas HTTP), history.js (localStorage), theme.js, preferences.js
│   │   └── App.jsx           # rotas (react-router-dom)
│   └── package.json
│
├── backend/                          # Java / Spring Boot
│   └── src/main/java/com/time13/techcontentclassifier/
│       ├── controller/    # ConteudoController — POST /conteudo e GET /conteudo
│       ├── service/        # ConteudoService (orquestra) + ClassificadorService (interface)
│       │   └── impl/        # MlServiceClassificadorService (RestClient para o FastAPI)
│       ├── dto/              # ConteudoRequestDTO, ConteudoResponseDTO, ConteudoHistoricoDTO, ExplicabilidadeDTO
│       ├── entity/           # Conteudo (JPA), Tags
│       ├── mapper/           # ConteudoMapper (DTO ↔ Entity, serializa/desserializa explicabilidade)
│       ├── repository/       # ConteudoRepository, TagsRepository
│       ├── exception/        # GlobalExceptionHandler, RespostaErros, MlServiceException
│       └── config/            # CorsConfig
│
├── ia/                                # Python / Ciência de Dados + FastAPI
│   ├── notebooks/
│   │   └── eda_treino_modelo.ipynb   # entregável obrigatório: EDA + treino + avaliação
│   ├── app/
│   │   ├── main.py            # FastAPI app, endpoints /predict, /categorias, /health
│   │   ├── model_loader.py    # carrega .joblib na subida (local ou OCI, ver seção 16.1)
│   │   ├── schemas.py          # Pydantic (TextInput, PredictionOutput, ExplicabilidadeItem)
│   │   └── keywords.py         # extração de palavras-chave + peso de explicabilidade
│   ├── scripts/                 # ingest_wikipedia.py, aumentar_dataset.py, train.py, evaluate.py, upload_to_oci.py
│   ├── tests/                    # pytest (test_predict.py, test_keywords.py)
│   ├── models/
│   │   ├── modelo.joblib
│   │   ├── vectorizer.joblib
│   │   └── metrics.json          # métricas do último treino (precision/recall/f1 por categoria)
│   ├── data/dataset.csv           # dataset de treino
│   ├── config.yaml                 # hiperparâmetros + stopwords
│   └── requirements.txt
│
├── infra/                             # não guarda arquivos — aponta pra onde a infra realmente vive (ver seção 16.2)
│
├── scripts/                           # Docker Compose (dev/prod), testes, build, deploy — ver seção 16.2
│
├── docs/
│   └── DOCUMENTACAO_PROJETO.md   (este arquivo)
│
├── docker-compose.yml / .dev.yml / .prod.yml
├── README.md
└── CONTRIBUTING.md
```

> Nota: o nome do diretório raiz e o pacote Java final (`com.time13.techcontentclassifier`, não `com.example`) refletem o que foi realmente implementado.

### 5.1 Explicação das pastas principais

- **`frontend/`**: aplicação React isolada; consome apenas o Backend Java, nunca o FastAPI diretamente
- **`backend/`**: segue o padrão em camadas Controller → Service → Repository, com DTOs separados de Entities e um handler global de exceções — organização que qualquer novo integrante reconhece de imediato
- **`ia/`**: contém o notebook (entregável obrigatório do edital) e o serviço FastAPI que reaproveita o mesmo modelo treinado, sem duplicar lógica de pré-processamento
- **`infra/`**: pasta mantida só pra preservar a estrutura de 5 áreas documentada aqui; o Docker Compose precisa estar na raiz do repositório pra ter acesso ao contexto de build de `backend/`, `frontend/` e `ia/` ao mesmo tempo — ver seção 16.2 pra onde cada coisa realmente está
- **`scripts/`**: scripts operacionais (subir/parar/testar/limpar o ambiente, build de produção) — não fazia parte da estrutura originalmente planejada, mas centraliza toda a operação do Docker Compose
- **`docs/`**: documentação viva do projeto

---

## 6. Divisão da Equipe (8 pessoas)

Cada área tem um líder responsável pelos cards daquela área no Trello e pela qualidade técnica das entregas. O líder não é o único executor — ele coordena, revisa e desempata decisões dentro da própria área.

| Área | Papel | Responsabilidades do líder | O que NÃO é do líder |
|---|---|---|---|
| Product Owner | Você | Priorizar backlog, validar entregas contra o edital, conduzir sprint planning e demo, decidir escopo do MVP | Escrever código; microgerenciar tarefas técnicas de outras áreas |
| Backend (Java) | Tech Lead Backend | Definir contratos de API, revisar PRs do backend, garantir validação e tratamento de erros | Treinar ou ajustar o modelo de ML; decidir layout do frontend |
| Ciência de Dados | Tech Lead Dados | Conduzir EDA, treino, avaliação e serialização do modelo; expor o FastAPI de inferência | Implementar regras de negócio do backend; UI do frontend |
| Frontend | Tech Lead Frontend | Definir componentes, consumo da API, tratamento de loading/erro na UI | Alterar contrato da API sem alinhar com o Backend |
| OCI/Cloud | Arquiteto OCI | Provisionar Object Storage e Compute, publicar artefatos, garantir que a API esteja acessível publicamente | Escrever lógica de negócio ou do modelo |
| QA | Especialista em Testes | Escrever casos de teste dos 3 exemplos obrigatórios, validar endpoints com Postman/Insomnia, reportar bugs | Corrigir os bugs (reporta para o líder da área correspondente) |
| DevOps | Engenheiro DevOps | Manter o pipeline de deploy simples funcionando, garantir que o ambiente hospedado espelha o local | Decidir arquitetura do produto |
| Documentação | Especialista em Hackathons | Manter o README atualizado, preparar o roteiro de demo, revisar a documentação final antes da entrega | Validar tecnicamente se o modelo está correto |

Como o time tem 8 pessoas mas 8 áreas, algumas pessoas podem acumular papéis (ex.: quem lidera QA também apoia Documentação), desde que backend e dados tenham líderes dedicados e exclusivos — são as duas áreas de maior risco técnico.

---

## 7. Backlog do Produto

O backlog segue a hierarquia Épico → Feature → User Story → Task → Subtask. Abaixo estão os 5 épicos que cobrem 100% do MVP obrigatório do edital, com o detalhamento de cada nível.

> **Status:** os 5 épicos foram concluídos. Preservado abaixo como planejamento original — alguns detalhes específicos mudaram durante a execução e valem registro: o dataset final ficou muito maior que os 60-100 exemplos estimados (seção 13); o cliente HTTP para o ML Service (`MlServiceClient`, Feature 2.2) foi implementado como `MlServiceClassificadorService`, seguindo um padrão de interface (`ClassificadorService`) que permite trocar a implementação sem tocar no resto da camada; o `GET /conteudo/{id}` (Feature 2.4) não foi implementado — a busca por palavra-chave (`GET /conteudo?palavra-chave=`) cobriu o mesmo caso de uso de forma mais flexível; e a extração de palavras-chave (Épico 1) ganhou também o peso de explicabilidade por termo, além da lista simples originalmente prevista.

### Épico 1 — Pipeline de Classificação de Conteúdo (Ciência de Dados)

**Descrição:** construir e treinar o modelo capaz de classificar conteúdo técnico por categoria, com métricas avaliadas e artefato serializado.
**Prioridade:** Crítica | **Responsável:** Tech Lead Dados | **Estimativa:** 21 pontos

**Feature 1.1 — Base de dados de treino**
- User Story: Como time de Dados, quero um dataset rotulado de 60-100 exemplos para treinar o modelo de classificação.
  - Critérios de aceite: dataset possui no mínimo 60 exemplos; ao menos 4 categorias distintas; colunas título, texto e categoria; sem duplicados.
  - Task: Definir categorias possíveis (ex.: Backend, Frontend, Dados, DevOps/Cloud)
  - Task: Montar dataset inicial (fontes públicas de documentação + produção própria)
    - Subtask: coletar exemplos por categoria
    - Subtask: revisar consistência dos rótulos
    - Subtask: exportar para CSV versionado em `ia/notebooks/dataset.csv`

**Feature 1.2 — Treinamento e avaliação do modelo**
- User Story: Como time de Dados, quero treinar e avaliar um modelo de classificação para garantir qualidade mínima aceitável.
  - Critérios de aceite: acurácia/F1 reportados no notebook; modelo serializado em `.joblib`; vetorizador salvo separadamente.
  - Task: Limpar e normalizar os textos (lowercase, remoção de stopwords/pontuação)
  - Task: Vetorizar textos com TF-IDF
  - Task: Treinar modelo de Regressão Logística
  - Task: Avaliar métricas (acurácia, F1) e salvar modelo com joblib
  - Dependências: Feature 1.1 concluída | Estimativa: 8 pontos

**Feature 1.3 — Serviço de inferência (FastAPI)**
- User Story: Como Backend, quero chamar um serviço interno que recebe texto e devolve categoria + probabilidade + keywords.
  - Critérios de aceite: endpoint interno `POST /predict` responde em JSON com categoria, probabilidade e lista de palavras-chave; modelo carregado uma única vez na subida do serviço.
  - Task: Criar app FastAPI e endpoint `/predict`
  - Task: Implementar carregamento do modelo/vetorizador em `model_loader.py`
  - Task: Implementar extração de palavras-chave via maiores pesos TF-IDF do texto recebido

### Épico 2 — API Backend (Java/Spring Boot)

**Descrição:** expor a API pública do produto, validar entradas, tratar erros e orquestrar a chamada ao serviço de ML.
**Prioridade:** Crítica | **Responsável:** Tech Lead Backend | **Estimativa:** 21 pontos

**Feature 2.1 — Esqueleto da API**
- User Story: Como Frontend, quero um endpoint `POST /conteudo` já disponível (mesmo que mockado) para começar a integrar cedo.
  - Task: Montar esqueleto do projeto Spring Boot (Web, Validation, springdoc-openapi)
  - Task: Criar endpoint `POST /conteudo` com resposta JSON mockada

**Feature 2.2 — Integração real com o ML Service**
- User Story: Como usuário da API, quero receber uma classificação real do meu conteúdo, não mais um mock.
  - Critérios de aceite: chamada ao FastAPI via cliente HTTP interno; timeout e erro tratados; resposta final no contrato do edital.
  - Task: Implementar `MlServiceClient` (RestClient) apontando para o serviço FastAPI
  - Task: Mapear resposta do ML Service para o DTO final da API pública

**Feature 2.3 — Robustez**
- User Story: Como PO, quero que a API nunca quebre com entradas inválidas, para não perder pontos na avaliação.
  - Task: Validação de entrada (título e texto obrigatórios, tamanho mínimo/máximo) com Bean Validation
  - Task: Tratamento de erros com `GlobalExceptionHandler` (400, 422, 500 padronizados)
  - Task (opcional): Endpoint de busca por palavra-chave reaproveitando o vetorizador TF-IDF

**Feature 2.4 — Persistência de resultados**
- User Story: Como PO, quero manter o histórico de conteúdos classificados para consulta posterior e para os recursos de busca do edital.
  - Critérios de aceite: cada classificação é gravada em PostgreSQL/MySQL após a resposta do ML Service; falha de escrita não impede a resposta ao usuário (best-effort); tabela `conteudos` conforme seção 15.
  - Task: Configurar Spring Data JPA e entidade `Conteudo`
  - Task: Implementar `ConteudoRepository` e persistência após a chamada ao ML Service
  - Task: Implementar `GET /conteudo/{id}` para consulta de um resultado já processado
  - Dependências: Feature 2.2 concluída | Estimativa: 5 pontos

### Épico 3 — Frontend

**Descrição:** interface simples para envio de conteúdo e visualização do resultado da classificação.
**Prioridade:** Alta | **Responsável:** Tech Lead Frontend | **Estimativa:** 13 pontos

**Feature 3.1 — Tela principal**
- User Story: Como usuário, quero colar um título e um texto e ver a categoria sugerida.
  - Task: Montar tela (campo de texto + botão + área de resultado)
  - Task: Consumir o endpoint mockado do backend na Semana 1

**Feature 3.2 — Integração real e experiência de uso**
- Task: Ajustar consumo para a resposta real da API (Semana 2)
- Task: Adicionar estado de loading e tratamento de erro de rede
- Task: Polimento visual e mensagens de erro amigáveis (Semana 3)

### Épico 4 — Infraestrutura e OCI

**Descrição:** hospedar a solução na OCI (Object Storage + Compute), cumprindo o requisito obrigatório de integração com serviços da Oracle Cloud, usando o Free Tier de estudante.
**Prioridade:** Crítica | **Responsável:** Arquiteto OCI | **Estimativa:** 13 pontos

**Feature 4.1 — Provisionamento**
- Task: Criar conta/projeto na OCI
- Task: Decidir serviços a usar (Object Storage para o modelo + Compute para hospedar os serviços e o container do banco)

**Feature 4.2 — Publicação**
- Task: Subir modelo/vetorizador serializados para o Object Storage
- Task: Hospedar Backend e ML Service na instância Compute e validar acesso público
- Task: Subir o container PostgreSQL/MySQL na mesma instância Compute e configurar volume persistente
- Task: Garantir fluxo completo (Frontend → Backend → ML Service → Banco) rodando na nuvem

### Épico 5 — Qualidade, Documentação e Demo

**Descrição:** garantir que o produto final seja testável, bem documentado e bem apresentado.
**Prioridade:** Alta | **Responsável:** QA + Documentação | **Estimativa:** 13 pontos

- Task: Testes de ponta a ponta com os 3 exemplos obrigatórios de uso
- Task: Escrever README completo (instruções, uso da API, exemplos, dependências)
- Task: Roteiro do pitch/demo e ensaio

---

## 8. Organização no Trello

O time já definiu as listas por semana (Semana 0 a Semana 5), como no arquivo `trello-cards-time13.txt`. Recomenda-se manter essa organização cronológica e adicionar 3 listas de fluxo transversais, para dar visibilidade de status a qualquer momento, além das listas semanais:

- **Backlog Geral** — todos os cards ainda não puxados para a semana corrente
- **Em Andamento / Em Revisão / Concluído** — quadro Kanban transversal, cada card semanal é movido por aqui conforme o progresso
- **Bloqueios** — para escalar impedimentos direto ao líder da área e ao PO

### 8.1 Padrão de card

Cada card do Trello deve seguir este template, preenchido no momento em que é puxado para a semana:

```
Título: [Área] Ação objetiva (ex.: [Backend] Criar endpoint POST /conteudo)
Descrição: contexto de 1-2 linhas + link do contrato/API se aplicável
Checklist: passos técnicos (setup, implementação, teste manual, PR aberto)
Critério de aceite: condição objetiva que define "pronto"
Responsável: 1 pessoa nomeada (etiqueta de membro do Trello)
Dependências: cards que precisam estar concluídos antes deste
Label de prioridade: Crítica / Alta / Média
```

Os cards do arquivo `trello-cards-time13.txt` já cobrem exatamente os épicos e features acima — a recomendação é colar o conteúdo já existente e, ao puxar cada card para "Em Andamento", completar o checklist e o responsável conforme o template.

---

## 9. Cronograma de Sprints

O time já possui um cronograma de 6 semanas (Semana 0 a Semana 5), coerente com a lógica recomendada: fundação → integração real → robustez → polimento/documentação → entrega final.

| Semana | Foco | Entregas obrigatórias | Por que essa ordem |
|---|---|---|---|
| 0 — Kickoff | Alinhamento | Apresentações, perfil completo, leitura do edital | Nenhuma linha de código deve começar antes de todos entenderem o escopo |
| 1 — Sprint 1 | Fundação em paralelo | Categorias + dataset inicial; esqueleto da API com mock; tela do frontend; conta OCI criada | O mock do backend libera o frontend a trabalhar sem depender do modelo pronto |
| 2 — Sprint 2 | Integração real | Modelo treinado e salvo; backend consumindo o modelo real; frontend consumindo a API real; modelo publicado no Object Storage | Só depois que o modelo existe é possível trocar o mock pela integração real — dependência direta da Semana 1 |
| 3 — Sprint 3 | Robustez | Validação de entrada; tratamento de erros; recurso opcional (busca por palavra-chave); polimento visual | Com o fluxo principal funcionando, o foco vira robustez — o que mais pesa na avaliação de qualidade |
| 4 — Sprint 4 | Consolidação | Testes de ponta a ponta; README completo; início do roteiro do pitch | Documentar e testar exige que o produto já esteja estável |
| 5 — Entrega final | Demo Day | Feedback aos colegas; ensaio da demo; entrega final; Demo Day 18/08 e 20/08 | Última semana é só ajuste fino e apresentação — nenhuma feature nova deve começar aqui |

**Regra de corte:** se, ao final da Semana 3, a Feature 2.3 (robustez) ou a integração real (Épico 1+2) não estiverem prontas, nenhuma tarefa nova de Semana 4 é aberta — o time inteiro migra para destravar o que está em risco. Isso protege o MVP obrigatório acima de qualquer recurso opcional.

---

## 10. Estratégia Git

> **Adaptação do time:** o modelo original desta documentação previa uma branch intermediária `develop` entre as `feature/*` e a `main`. O time decidiu **remover essa etapa** para simplificar o fluxo, já que a maior parte da equipe está começando a trabalhar em grupo com Git/GitHub agora. Menos branches para gerenciar = menos chance de confusão. O restante da lógica (nomes de branch, commits, PRs revisados) continua igual.

### 10.1 Modelo de branches (simplificado, sem `develop`)

| Branch | Propósito | Regra |
|---|---|---|
| `main` | Código de integração e produção — o que será hospedado na OCI | Nunca commit direto; só recebe merge via Pull Request revisado por pelo menos 1 outra pessoa |
| `feature/<area>-<descricao>` | Uma funcionalidade nova | Nasce de `main`, volta para `main` via PR |
| `bugfix/<descricao>` | Correção de bug encontrado durante a sprint | Nasce de `main`, volta para `main` via PR |
| `hotfix/<descricao>` | Correção urgente em algo já em `main` (ex.: quebra no Demo Day) | Nasce de `main`, volta para `main` via PR o mais rápido possível |

Como não existe mais uma branch de integração intermediária, é ainda mais importante que `main` **sempre builde** — antes de abrir o PR, rode o projeto localmente (ver seção 17.3 do README) e confirme que nada quebrou.

### 10.2 Padrão de nomes

- `feature/backend-endpoint-conteudo`
- `feature/ml-treino-modelo`
- `feature/frontend-tela-resultado`
- `feature/oci-object-storage`
- `bugfix/backend-validacao-texto-vazio`
- `hotfix/ml-service-timeout`

Toda branch deve referenciar a área no prefixo (`backend`, `frontend`, `ml`, `oci`) para facilitar a leitura do histórico e o vínculo com o card do Trello correspondente.

Fluxo prático de contribuição: veja [`CONTRIBUTING.md`](../CONTRIBUTING.md) na raiz do repositório para o passo a passo completo.

---

## 11. Padrão de Commits (Conventional Commits)

| Prefixo | Quando usar |
|---|---|
| `feat:` | nova funcionalidade (ex.: `feat: adiciona endpoint POST /conteudo`) |
| `fix:` | correção de bug (ex.: `fix: corrige validação de texto vazio`) |
| `refactor:` | mudança de código sem alterar comportamento externo |
| `docs:` | mudanças apenas em documentação (README, notebook markdown) |
| `test:` | adição ou ajuste de testes |
| `style:` | formatação, espaçamento, sem mudança de lógica |
| `chore:` | tarefas de manutenção (dependências, configs, scripts de build) |

Formato completo recomendado: prefixo, escopo entre parênteses e descrição curta no imperativo — ex.: `feat(backend): adiciona validação de entrada no endpoint /conteudo`.

---

## 12. Padrões de Código

### 12.1 Java / Spring Boot

- Camadas separadas: Controller (HTTP) → Service (regra de negócio) → Repository (persistência), nunca pular camada
- DTOs de entrada/saída sempre diferentes das Entities JPA
- Bean Validation nas anotações do DTO (`@NotBlank`, `@Size`) em vez de validação manual espalhada
- Um único `@ControllerAdvice` para tratar exceções, nunca try/catch genérico no Controller
- Nomes de pacotes em minúsculo, classes em PascalCase, métodos em camelCase

### 12.2 Python

- Seguir PEP 8; nomes de função e variável em snake_case
- Funções pequenas e puras no notebook antes de qualquer treino (facilita reaproveitar no `model_loader.py`)
- Pydantic para schemas de entrada/saída do FastAPI, nunca dict solto
- Modelo e vetorizador carregados uma única vez na inicialização do processo (nunca por requisição)

### 12.3 React

- Componentes funcionais com Hooks, nunca class components
- Estado de loading e erro sempre explícito (`isLoading`, `error`) — nunca inferido pela ausência de dados
- Chamadas de API isoladas em `services/api.js`, nunca fetch direto dentro do componente

### 12.4 SQL (se a persistência opcional entrar)

- Nomes de tabela no plural e em snake_case (ex.: `conteudos`)
- Toda tabela com chave primária numérica auto-incrementada e coluna `criado_em`
- Índice na coluna `categoria`, por ser o principal filtro de consulta

---

## 13. Estratégia de Ciência de Dados

> **Status final:** o dataset cresceu muito além dos 60-100 exemplos mínimos planejados abaixo — a versão final tem **6.496 exemplos em 10 categorias exclusivamente tech** (Backend, Dados, DevOps, Frontend, Mobile, Cibersegurança, Cloud/Infra, QA, Blockchain, UX/UI), combinando artigos reais da Wikipédia (coletados via `ia/scripts/ingest_wikipedia.py`, com filtros anti-alucinação pra evitar conteúdo fora do domínio tech) com exemplos curtos sintéticos no formato real de uso da API (`ia/scripts/aumentar_dataset.py`) — a mistura foi necessária porque um modelo treinado só com artigos longos da Wikipédia classificava mal os textos curtos que a API realmente recebe. Acurácia final: **91.9%** (F1-weighted), métricas completas em `ia/models/metrics.json`.

| Etapa | O que fazer | Por quê |
|---|---|---|
| Coleta | Reunir 60-100 exemplos de conteúdo técnico rotulados por categoria (Backend, Frontend, Dados, DevOps/Cloud, etc.), de fontes públicas de documentação e produção própria da equipe | Volume mínimo do edital; múltiplas fontes evitam viés de vocabulário |
| EDA | Contar exemplos por categoria, tamanho médio dos textos, palavras mais frequentes | Detecta desbalanceamento de classes antes de treinar |
| Limpeza | Lowercase, remoção de pontuação e stopwords em português, tokenização simples | Reduz ruído sem exigir NLP avançado |
| Normalização | Remover acentuação apenas se necessário; manter termos técnicos (ex.: 'API', 'Spring') intactos | Termos técnicos são o principal sinal discriminante entre categorias |
| Transformação | `TfidfVectorizer` do Scikit-Learn (`ngram_range=(1,2)`, `max_features` ajustado ao tamanho do dataset) | Sugestão direta do edital; bigrams capturam termos como 'spring boot' ou 'machine learning' |
| Treinamento | `LogisticRegression` (multi-classe, `class_weight='balanced'`) | Simples, rápido, interpretável, funciona bem com poucos dados e é o sugerido pelo edital |
| Avaliação | Acurácia + F1-macro em validação cruzada (k-fold, já que o dataset é pequeno) ou holdout 80/20 | F1-macro evita que uma classe majoritária esconda o desempenho ruim nas demais |
| Serialização | `joblib.dump` do modelo e do vetorizador em arquivos separados | Permite versionar e substituir cada artefato de forma independente |

### 13.1 Extração de palavras-chave (`informacoes_adicionais`)

Em vez de um segundo modelo, o time reaproveita o próprio vetorizador TF-IDF: para cada texto recebido, calculam-se os pesos TF-IDF de cada termo e retornam-se os N termos de maior peso como palavras-chave. Essa abordagem é sugerida pelo edital ("identificação de palavras-chave"), não exige treinar nada além do que já existe e resolve o campo `informacoes_adicionais` do contrato com esforço mínimo.

---

## 14. Especificação da API

### 14.1 Endpoints

Endpoints do Backend (API pública, consumida pelo Frontend):

| Método | Rota | Descrição |
|---|---|---|
| POST | `/conteudo` | Recebe título e texto, devolve categoria, probabilidade, informações adicionais e explicabilidade (contrato fixo do edital) |
| GET | `/conteudo?palavra-chave=` | Busca nos conteúdos já persistidos (título, texto, categoria, tags); termo vazio devolve tudo. Devolve também `id`, `titulo`, `texto` e `criado_em` de cada item — usado pela Base de Conhecimento do frontend |

> Nota: o plano original também previa `GET /categorias` e `GET /conteudo/{id}` — nenhum dos dois foi exposto pelo Backend (o `/categorias` existe só internamente no serviço de ML, não repassado pro Frontend; e a busca por `id` acabou não sendo necessária depois que a busca por palavra-chave foi implementada, que já cobre o caso de uso de encontrar um conteúdo específico).

### 14.2 Contrato principal — `POST /conteudo`

Request:
```json
{
  "titulo": "Introdução ao Spring Boot",
  "texto": "Neste conteúdo são apresentados os conceitos básicos..."
}
```

Response 200:
```json
{
  "categoria": "Backend",
  "probabilidade": 0.89,
  "informacoes_adicionais": ["Java", "Spring Boot", "API REST"],
  "explicabilidade": [
    { "termo": "spring", "peso": 1.0 },
    { "termo": "boot", "peso": 0.85 }
  ]
}
```

O campo `explicabilidade` (peso relativo de 0 a 1 de cada termo na decisão do modelo) foi adicionado depois da versão original deste contrato — é aditivo, não quebra quem só lê os 3 campos originais.

### 14.3 Validações

- `titulo`: obrigatório, entre 3 e 200 caracteres
- `texto`: obrigatório, entre 20 e 5000 caracteres (textos muito curtos não geram sinal suficiente para o TF-IDF)
- Requisições sem `Content-Type: application/json` são rejeitadas com 415

### 14.4 Tratamento de erros

O formato final de erro ficou mais detalhado que o rascunho original do edital — inclui `status`, `titulo` (curto, tipo do erro), `mensagem`, `timestamp` e, quando aplicável, a lista `erros` com o detalhe por campo:

```json
{
  "status": 400,
  "titulo": "Erro de Validação",
  "mensagem": "Um ou mais campos contêm valores inválidos.",
  "timestamp": "2026-08-07T23:28:41",
  "erros": [
    { "campo": "texto", "mensagem": "O texto deve ter entre 20 e 5000 caracteres" }
  ]
}
```

Casos tratados pelo `GlobalExceptionHandler`:

- **400** — campos inválidos (`erros` detalhado por campo), JSON malformado, ou parâmetro obrigatório ausente (ex.: `GET /conteudo` sem `palavra-chave`)
- **415** — `Content-Type` diferente de `application/json`
- **503** — serviço de ML indisponível ou timeout na chamada interna (o Backend nunca deixa a exceção vazar sem tratamento)
- **500** — qualquer erro não previsto explicitamente, como rede de segurança

O edital só especifica o formato da resposta de sucesso (seção 2.4) — o formato de erro ficou a critério do time, e esse é o que foi implementado.

### 14.5 Três exemplos obrigatórios de uso

| # | Título de entrada | Categoria esperada |
|---|---|---|
| 1 | Introdução ao Spring Boot | Backend |
| 2 | Como criar componentes reutilizáveis em React | Frontend |
| 3 | Treinando um modelo de classificação com Scikit-Learn | Dados |

---

## 15. Modelagem de Banco de Dados

O edital cita persistência como recurso opcional, mas o time optou por incluí-la no MVP, usando PostgreSQL (seção 3) em vez de um banco gerenciado da Oracle — cobrindo o histórico de classificações e servindo de base para o recurso opcional de busca por palavra-chave.

Diferente do plano original, o schema não é criado por migration manual — `spring.jpa.hibernate.ddl-auto=update` deixa o Hibernate criar/atualizar as tabelas automaticamente a partir das entidades JPA a cada subida da aplicação (não há Flyway/Liquibase nesse projeto).

### 15.1 Tabela `conteudos`

| Campo | Tipo (PostgreSQL) | Observação |
|---|---|---|
| id | BIGINT, PK, auto-incremento (IDENTITY) | Identificador único |
| titulo | VARCHAR(200) | Título recebido na requisição |
| texto | TEXT | Texto completo recebido |
| categoria | VARCHAR(50) | Resultado da classificação |
| probabilidade | DOUBLE | Confiança do modelo na predição |
| informacoes_adicionais | VARCHAR(500) | Palavras-chave separadas por vírgula |
| explicabilidade | TEXT | Lista termo/peso serializada em JSON (ver seção 14.2) — campo adicionado depois do MVP inicial; conteúdo salvo antes disso fica com este campo vazio |
| criado_em | TIMESTAMP | Data/hora do processamento, preenchido pela aplicação (Spring), exposta pela API como `Instant` em UTC |

### 15.2 Relacionamento com `tags`

Diferente do plano original ("sem relacionamentos adicionais no MVP"), o time acabou criando uma segunda tabela, `tags`, com relação `@ManyToMany` a partir de `conteudos` (tabela de junção `conteudo_tags`) — cada palavra-chave identificada vira uma `Tag` reaproveitável entre conteúdos diferentes, em vez de só texto solto. Isso é usado pela busca por palavra-chave (`GET /conteudo`), que também considera o nome das tags associadas, além do texto/título/categoria.

Como a escrita é best-effort (seção 3.5), a tabela não bloqueia o fluxo principal caso o banco esteja temporariamente indisponível.

---

## 16. Integração com OCI

| Serviço OCI | Uso no projeto | Por quê |
|---|---|---|
| Object Storage | Armazenar `modelo.joblib` e `vectorizer.joblib` versionados | Cumpre o requisito obrigatório de integração OCI da forma mais simples e barata (tier always-free) |
| Compute (`VM.Standard.E2.1.Micro`) | Hospedar Backend, Frontend, ML Service e o container do banco (PostgreSQL) | Instância always-free suficiente para uma API de demonstração de hackathon; um único host simplifica a rede interna entre os componentes |

O banco de dados (PostgreSQL) não é um serviço Oracle gerenciado — é um container Docker rodando dentro da própria instância Compute. Isso mantém a stack simples de operar e ainda assim garante que a integração obrigatória com a OCI (Object Storage + Compute) está coberta com folga — **o Compute sozinho já cumpre o "pelo menos um serviço OCI" do edital**, hospedando a aplicação inteira (backend, ML, frontend e banco) em `tech-mind.duckdns.org`.

### 16.1 Fluxo de integração — como foi planejado vs. como funciona hoje

O plano original prometia: modelo publicado no Object Storage ao final de cada treino, e o serviço de ML baixando de lá a cada subida. Na prática, isso não é bem o que acontece, e vale registrar com honestidade o porquê, já que essa foi uma correção feita depois de uma auditoria específica sobre esse ponto:

1. `modelo.joblib` e `vectorizer.joblib` são **versionados no próprio repositório Git** — cada retreinamento comita a nova versão junto com o código, prática natural do fluxo de trabalho de Ciência de Dados do time.
2. O Dockerfile do serviço de ML copia todo o diretório `ia/` (incluindo os `.joblib`) pra dentro da imagem no build. Como esses arquivos já vêm do Git, eles estão sempre presentes localmente.
3. `model_loader.py` só tenta baixar do OCI Object Storage **quando o arquivo não existe localmente** — como o passo 2 garante que sempre existe, esse download nunca é de fato acionado em produção hoje. O código e a integração existem e funcionam (testável isoladamente), mas esse caminho específico não é o que sustenta a aplicação no dia a dia.
4. O upload pro Object Storage (`ia/scripts/upload_to_oci.py`) continua sendo executado a cada retreinamento — isso por si só já cumpre o requisito de "integração com serviço OCI" (o artefato é publicado e versionado lá), mesmo que o download de volta não seja o caminho ativo.
5. O Backend, o ML Service e o container do banco rodam na mesma instância Compute, comunicando-se por rede interna via Docker Compose.
6. O Backend persiste cada resultado no banco após a resposta do ML Service, em modo melhor-esforço (seção 3.5).
7. O Frontend é publicado na mesma instância, servido via Nginx com HTTPS (Let's Encrypt).

**Por que isso não compromete o requisito obrigatório**: o edital pede "integração com pelo menos um serviço OCI", e o Compute sozinho — hospedando a aplicação inteira, ao vivo — já satisfaz isso com folga, como o parágrafo acima já registra. O Object Storage é uma segunda integração real (upload funciona, artefato fica lá versionado), só não é o mecanismo que efetivamente entrega o modelo em produção hoje. Fazer o download do OCI ser o caminho realmente usado é uma melhoria possível (remover os `.joblib` do Git, forçar o download), mas envolve risco em produção — ver seção 21.

### 16.2 Onde a infraestrutura vive no repositório

A pasta `infra/` (seção 5) foi pensada originalmente pra concentrar Docker Compose e scripts de deploy, mas isso nunca aconteceu ali na prática — o Docker Compose precisa estar na **raiz do repositório** pra ter acesso ao contexto de build de `backend/`, `frontend/` e `ia/` ao mesmo tempo (`context: ./backend`, etc.). A infraestrutura real está em:

| O que | Onde |
|---|---|
| Orquestração dos containers | `docker-compose.yml` + overrides `docker-compose.dev.yml` / `docker-compose.prod.yml`, na raiz |
| Scripts operacionais (subir/parar/testar/limpar/build) | `scripts/` |
| Configuração do Nginx (proxy + HTTPS) | `frontend/nginx.conf` |
| Upload do modelo pro Object Storage | `ia/scripts/upload_to_oci.py` |
| Download do modelo a partir do Object Storage | `ia/app/model_loader.py` (ver 16.1 sobre quando isso é de fato acionado) |

---

## 17. Estrutura do README

O README é um entregável obrigatório e também a primeira impressão de quem avalia o projeto. Estrutura recomendada, com o que cada seção deve conter:

1. **Sobre o projeto:** duas ou três frases explicando o problema do edital e a solução entregue
2. **Arquitetura:** o diagrama ASCII da seção 3.4 e um parágrafo curto explicando o fluxo
3. **Como executar localmente:** passo a passo para subir backend, ml service e frontend (comandos exatos, sem omitir nada)
4. **Como usar a API:** os endpoints da seção 14, com request e response reais
5. **Exemplos de uso:** os 3 exemplos obrigatórios (seção 14.5), com o resultado real obtido
6. **Dependências e versões:** lista exata de bibliotecas e versões usadas em cada serviço (`requirements.txt` e `pom.xml` resumidos)
7. **Integração com OCI:** quais serviços foram usados e como reproduzir o deploy
8. **Time:** nome e área de cada integrante
9. **Link da demo:** vídeo do YouTube (Tarefa 2 da plataforma) e links do projeto (Tarefa 4)

---

## 18. Roteiro do Demo Day

Tempo total recomendado: 5 a 7 minutos, considerando que múltiplos times apresentam no mesmo dia. Ordem pensada para prender a atenção do avaliador nos primeiros 30 segundos.

| Ordem | Quem fala | Tempo | O que mostrar |
|---|---|---|---|
| 1 | Product Owner | 1 min | O problema (edital) em uma frase + por que a solução do time resolve isso |
| 2 | Tech Lead Dados | 1.5 min | Como o modelo foi treinado (TF-IDF + Regressão Logística) e as métricas obtidas — sem entrar em código, focar no resultado |
| 3 | Tech Lead Backend + Frontend | 2.5 min | Demo ao vivo: os 3 exemplos obrigatórios sendo enviados pela tela e a resposta chegando em tempo real |
| 4 | Arquiteto OCI | 1 min | Onde e como a solução está hospedada na OCI (mostrar o console ou a URL pública funcionando) |
| 5 | Product Owner | 1 min | Fechamento: o que foi entregue 100% do MVP + 1 melhoria futura mais empolgante, para deixar boa impressão final |

### 18.1 O que nunca esquecer

- Testar a demo ao vivo em rede real (não localhost) pelo menos uma vez antes da apresentação
- Ter um vídeo gravado como fallback caso a internet falhe no dia
- Preparar respostas curtas para as perguntas mais prováveis: "por que Regressão Logística e não um LLM?", "como vocês avaliaram o modelo?", "o que fariam com mais tempo?"
- Nunca deixar mais de uma pessoa falando ao mesmo tempo nem passar do tempo definido

---

## 19. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Integração HTTP entre Backend (Java) e ML Service (Python) atrasa | Alto | Contrato interno `/predict` fixado já na Semana 1; Backend consome um mock idêntico ao contrato até o modelo estar pronto |
| Modelo com baixa acurácia por poucos dados | Médio | Ampliar dataset priorizando as categorias mais fracas identificadas na EDA; usar `class_weight='balanced'` |
| Membro do time fica indisponível | Médio | Nenhuma área deve depender de uma única pessoa sem par de apoio (ver Plano B, seção 20) |
| OCI apresenta instabilidade ou limites do tier gratuito | Médio | Testar o deploy a partir da Semana 2, nunca deixar para a última semana |
| Escopo cresce além do MVP (feature creep) | Alto | Toda ideia nova passa primeiro pela seção 21 (Melhorias Futuras) e só entra no MVP com aprovação explícita do PO |
| Equipe júnior trava em configuração de ambiente | Médio | README com passo a passo testado por alguém que não montou o ambiente originalmente |
| Demo falha ao vivo (rede, servidor fora do ar) | Alto | Vídeo gravado como fallback + testar a URL pública no dia anterior |

---

## 20. Plano B (Contingência)

| Cenário | Ação imediata |
|---|---|
| Membro do time indisponível | O líder da área assume temporariamente os cards críticos; tarefas não-críticas daquela pessoa são replanejadas para a semana seguinte |
| Modelo não atinge qualidade aceitável | Reduzir o número de categorias para as mais bem representadas no dataset, aumentando a separabilidade e a acurácia; documentar a limitação no README com transparência |
| OCI apresenta problemas de provisionamento | Fallback para hospedar Backend e ML Service em uma VM/serviço gratuito alternativo apenas para a demo, mantendo o Object Storage (requisito obrigatório) funcionando à parte |
| API não fica pronta a tempo | Priorizar sem exceção o endpoint `POST /conteudo` com o contrato exato do edital; qualquer endpoint opcional (categorias, busca por palavra-chave) é cortado primeiro |
| Integração Backend↔ML Service não fica pronta | Fallback para Opção A da arquitetura (seção 3.2): FastAPI assume também a exposição pública do endpoint `/conteudo`, e o Spring Boot é apresentado como camada de validação futura no roadmap |

---

## 21. Melhorias Futuras (fora do MVP)

Ideias tecnicamente interessantes, listadas originalmente como fora do escopo obrigatório do edital. Várias acabaram sendo entregues de qualquer forma, porque o tempo sobrou ou porque a necessidade apareceu no meio do caminho — marcadas abaixo.

**Já entregues** (deixadas aqui só como registro do plano original):

- ~~Containerização completa com Docker Compose para todos os serviços~~ — feito; os 4 serviços (Postgres, backend, ML, frontend) sobem juntos via `docker-compose.yml`
- ~~Explicabilidade do modelo~~ — feito; cada termo vem com peso relativo (`explicabilidade`, seção 14.2), calculado a partir dos coeficientes da Regressão Logística × TF-IDF, exibido como barra de porcentagem na tela Analisar, no Histórico e na Base de Conhecimento
- ~~Consulta e filtro avançado por categoria~~ — feito, o filtro por categoria existe na Base de Conhecimento; a parte de **paginação** continua pendente (ver abaixo)

**Ainda pendentes:**

- Busca semântica com embeddings (ex.: sentence-transformers) para recomendação de conteúdos relacionados
- Uso de LLM/RAG para gerar resumos automáticos do conteúdo processado
- Chat conversacional sobre a base de conhecimento
- Dashboard avançado com gráficos de distribuição de categorias ao longo do tempo
- Suíte de testes automatizados end-to-end cross-serviço (hoje cada serviço tem sua própria suíte — backend com JUnit/Mockito incluindo testes de integração HTTP, ML service com Pytest — mas não existe um teste que percorra Frontend → Backend → ML → Banco de ponta a ponta)
- Processamento em lote via upload de CSV
- Paginação na busca por palavra-chave (`GET /conteudo`) — hoje devolve a lista inteira de uma vez; não é problema com o volume atual de dados, mas precisaria de `Pageable` no backend e controles de página no frontend antes de escalar
- Fazer o download do OCI Object Storage ser o caminho realmente usado pelo serviço de ML (hoje o artefato vem do Git, ver seção 16.1) — puramente uma melhoria de consistência arquitetural, não afeta o cumprimento do requisito obrigatório nem a nota
- CI/CD (GitHub Actions): rodar os testes automaticamente em cada Pull Request, e opcionalmente automatizar o deploy — hoje ambos são manuais
- Moderação/curadoria de conteúdo na Base de Conhecimento (hoje não existe endpoint de exclusão; limpeza de dados de teste é feita manualmente no banco)

Nenhum item desta lista deve ser iniciado antes que todos os requisitos obrigatórios das seções 2.2 e 7 estejam 100% concluídos e testados — regra que continua valendo mesmo com o MVP entregue, pra qualquer ciclo futuro do projeto.
