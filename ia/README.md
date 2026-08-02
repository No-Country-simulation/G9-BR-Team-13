# ia/

Serviço de Ciência de Dados / Machine Learning: treina o modelo de classificação de conteúdo técnico e expõe um serviço interno de inferência (FastAPI) chamado pelo backend Java via `POST /predict`.

## Stack

- Python 3.11+, FastAPI, Scikit-Learn, `joblib`, Pydantic (validação)
- Algoritmo: TF-IDF + **LogisticRegression** (multinomial, `predict_proba` nativo)
- Categorias: **10 exclusivamente tech** (Backend, Dados, DevOps, Frontend, Mobile, Ciberseguranca, Cloud/Infra, QA, Blockchain, UX/UI)
- Testes: **pytest** (8 testes unitários em `tests/`)
- Stopwords: **português** (lista curada inline no `config.yaml`)
- CORS habilitado (allow_origins=["*"])
- OCI Object Storage (`app/model_loader.py` baixa os artefatos de lá se `OCI_NAMESPACE` estiver configurado; autenticação via Resource Principal (fallback `~/.oci/config`), região configurável via `OCI_REGION`; roda localmente sem OCI se os `.joblib` já existirem)

## Status

- **Modelo treinado:** TF-IDF + LogisticRegression (multinomial, `class_weight='balanced'`)
- **Acurácia atual:** **91.9%** (F1-weighted: ~0.919, holdout 20% com GridSearchCV)
- **Dataset:** 6.496 exemplos — 1.496 artigos reais da Wikipedia em português (10 categorias exclusivamente tech, filtrados contra alucinação) + **5.000 exemplos curtos sintéticos** no formato real de uso da API (ex: "Introdução ao Spring Boot")
- **Origem dos dados:** Wikipedia API via `scripts/ingest_wikipedia.py` (dados reais) + `scripts/aumentar_dataset.py` (exemplos curtos sintéticos)
- **Stopwords:** português (lista curada no `config.yaml`)
- **Validação de entrada:** Pydantic com `Field(min_length, max_length)` — titulo (3-200), texto (20-5000)
- **Contrato:** campo `informacoes_adicionais` conforme seção 14.2 do doc
- **Testes:** 8 testes pytest em `tests/test_predict.py`

## Como rodar localmente

```bash
cd ia
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
pip install -r requirements-dev.txt   # (opcional) para rodar o notebook
cp .env.example .env          # ajuste as variáveis se for usar OCI
uvicorn app.main:app --reload --port 8000
```

Para treinar o modelo do zero:

```bash
python scripts/ingest_wikipedia.py              # baixa dados reais da Wikipedia (artigos tech, 10 categorias)
python scripts/aumentar_dataset.py 500          # adiciona 5.000 exemplos curtos sintéticos (formato real da API)
python scripts/train.py                         # treina e salva models/modelo.joblib + models/vectorizer.joblib
```

Para acompanhar EDA + treino no notebook:

```bash
pip install -r requirements-dev.txt
jupyter notebook notebooks/eda_treino_modelo.ipynb
```

## Estrutura

```
ia/
├── notebooks/
│   └── eda_treino_modelo.ipynb   # notebook EDA + treino + avaliação (entregável obrigatório)
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app, endpoints POST /predict, GET /categorias, GET /health
│   ├── schemas.py                # Pydantic models com validação (TextInput, PredictionOutput)
│   ├── model_loader.py           # download do OCI + carga dos artefatos .joblib (paths absolutos)
│   └── keywords.py               # extração de palavras-chave a partir dos coeficientes do classificador
├── scripts/
│   ├── ingest_wikipedia.py            # gera dataset real via Wikipedia API com filtros anti-alucinação ⭐
│   ├── aumentar_dataset.py            # mescla exemplos curtos sintéticos no formato real da API
│   ├── train.py                   # treina o pipeline (TF-IDF + LogisticRegression) e salva métricas
│   ├── evaluate.py                # testa o modelo salvo manualmente via input no terminal
│   └── upload_to_oci.py           # upload dos artefatos .joblib para OCI Object Storage
├── tests/
│   ├── __init__.py
│   └── test_predict.py            # suite de testes pytest (8 testes: validação, schemas, keywords)
├── data/
│   └── dataset.csv                # dataset principal (6.496 exemplos, 10 categorias tech)
├── models/
│   ├── modelo.joblib              # classificador LogisticRegression serializado
│   ├── vectorizer.joblib           # vetorizador TF-IDF serializado
│   └── metrics.json               # métricas de avaliação (precision, recall, f1)
├── config.yaml                    # hiperparâmetros do TF-IDF / LogisticRegression + stopwords pt
├── requirements.txt
├── requirements-dev.txt   # dependências para o notebook (matplotlib, seaborn, jupyter)
├── Dockerfile
└── .env.example
```

## Pipeline de dados e filtros anti-alucinação

O `scripts/ingest_wikipedia.py` coleta dados reais da Wikipedia com **3 camadas de filtro** para garantir que apenas conteúdo tech entre no dataset (eliminando músicas, esportes, turismo, etc. que poluíam o dataset original):

1. **Filtro de namespace** (`srnamespace=0`) — apenas artigos principais, sem páginas de discussão/utilizador.
2. **Filtro de título** — rejeita padrões obviamente não-tech via regex (`NON_TECH_TITLE_PATTERNS`, ex: nomes de artistas, times, cidades).
3. **Filtro de categorias Wikipedia** — o artigo precisa pertencer a ao menos uma categoria da whitelist tech (`TECH_CATEGORIES_WHITELIST`, 150+ categorias via `prop=categories`).
4. **Filtro de conteúdo** — o texto precisa conter vocabulário tech mínimo (`TECH_VOCABULARY`).

Além disso, termos de busca por categoria foram desambiguados (ex: `Framework (software)`, `Container (software)`, `Java (linguagem de programacao)`) para evitar ambiguidade com linguagem comum.

### Por que exemplos curtos sintéticos?

O modelo treinado apenas com artigos longos da Wikipedia (~1000 caracteres) classificava mal os textos curtos e limpos que a API realmente recebe (ex: *"Neste conteúdo são apresentados os conceitos básicos para criação de APIs REST utilizando Java e Spring Boot."*).

O `scripts/aumentar_dataset.py` gera 500 exemplos por categoria em formatos próximos ao uso real (Introdução a X, Fundamentos de X, Como usar X na prática, etc.), mesclando-os com os dados reais.

Resultado medido em experimento controlado (holdout com dados reais não vistos):

| Cenário | Acurácia em textos curtos | Acurácia em dados reais (holdout) |
|---|---|---|
| Apenas Wikipedia | 60.3% | 61.8% |
| Wikipedia + exemplos curtos | 100.0% | 69.7% |

Com o dataset final aumentado, a acurácia do holdout interno subiu de **62.9% para 91.9%**.

## Contrato dos endpoints

### POST /predict

O serviço expõe o endpoint interno `POST /predict` (consumido pelo backend Java):

**Request:**
```json
{
  "titulo": "Introdução ao Spring Boot",
  "texto": "Neste conteúdo são apresentados os conceitos..."
}
```

**Response 200:**
```json
{
  "categoria": "Backend",
  "probabilidade": 0.99,
  "informacoes_adicionais": ["Java", "Spring Boot", "API REST"]
}
```

**Validação de entrada:**
- `titulo`: obrigatório, entre 3 e 200 caracteres
- `texto`: obrigatório, entre 20 e 5000 caracteres

### GET /categorias

Lista as categorias suportadas pelo modelo treinado:

```json
{ "categorias": ["Backend", "Dados", "DevOps", "Frontend", "Mobile", "Ciberseguranca", "Cloud/Infra", "QA", "Blockchain", "UX/UI"] }
```

### GET /health

Verificação de saúde do serviço:

```json
{
  "status": "ok",
  "modelo_carregado": true,
  "categorias": ["Backend", "Dados", "DevOps", "Frontend", "Mobile", "Ciberseguranca", "Cloud/Infra", "QA", "Blockchain", "UX/UI"]
}
```

## Regras importantes

- O modelo é carregado **uma única vez** na inicialização do processo (`lifespan`), nunca a cada requisição.
- `.env` real (com credenciais) nunca vai para o Git — só `.env.example`. `.venv/`, `__pycache__/` e `*.pyc` já estão no `.gitignore` da raiz.

## Testes

```bash
cd ia
python -m pytest tests/ -v
```

Suite com 8 testes: validação Pydantic (titulo/texto curto/longo), schema PredictionOutput, extração de keywords com modelo carregado.

## Upload para OCI Object Storage

Após treinar o modelo, para publicar os artefatos no OCI:

```bash
cd ia
export OCI_BUCKET_NAME=techknowledge-models
export OCI_NAMESPACE=seu-namespace
export OCI_REGION=us-ashburn-1          # opcional, padrão us-ashburn-1
python scripts/upload_to_oci.py
```

Ou via OCI CLI:

```bash
oci os object put --bucket-name techknowledge-models --file models/modelo.joblib --name modelo.joblib
oci os object put --bucket-name techknowledge-models --file models/vectorizer.joblib --name vectorizer.joblib
```

Mais contexto (estratégia de ciência de dados): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 13 e 16.
