# ia/

Serviço de Ciência de Dados / Machine Learning: treina o modelo de classificação de conteúdo técnico e expõe um serviço interno de inferência (FastAPI) chamado pelo backend Java via `POST /predict`.

## Stack

- Python 3.11, FastAPI, Scikit-Learn, `joblib`, Pydantic (validação)
- Algoritmo: TF-IDF + **LogisticRegression** (multinomial, `predict_proba` nativo)
- Categorias: **10 exclusivamente tech** (Backend, Dados, DevOps, Frontend, Mobile, Ciberseguranca, Cloud/Infra, QA, Blockchain, UX/UI)
- Testes: **pytest** (8 testes unitários em `tests/`)
- Logging: **JSON estruturado** (`app/logging_config.py` — formato padronizado para observabilidade)
- Stopwords: **português** (lista curada inline no `config.yaml`)
- CORS habilitado (allow_origins=["*"])
- OCI Object Storage (`app/model_loader.py` baixa os artefatos de lá se `OCI_NAMESPACE` estiver configurado; roda localmente sem OCI se `models/modelo.joblib` e `models/vectorizer.joblib` já existirem)

## Status

- **Modelo treinado:** TF-IDF + LogisticRegression (multinomial)
- **Acurácia atual:** ~88.2% (F1-weighted: ~0.88, validação cruzada com GridSearchCV)
- **Dataset:** 1481 exemplos reais da Wikipedia em português, 10 categorias exclusivamente tech (Backend, Dados, DevOps, Frontend, Mobile, Ciberseguranca, Cloud/Infra, QA, Blockchain, UX/UI), ~148 por categoria, média de ~987 caracteres
- **Origem dos dados:** Wikipedia API via `scripts/ingest_wikipedia.py` (dados reais, não sintéticos)
- **Stopwords:** português (lista curada no `config.yaml`)
- **Validação de entrada:** Pydantic com `Field(min_length, max_length)` — titulo (3-200), texto (20-5000)
- **Contrato:** campo `informacoes_adicionais` conforme seção 14.2 do doc
- **Testes:** 8 testes pytest em `tests/test_predict.py`
- **Logging:** JSON estruturado com `JsonFormatter` em `app/logging_config.py`
- **Docker:** HEALTHCHECK configurado via `curl /health` (intervalo 30s, timeout 10s, 3 retries)

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

Para treinar o modelo do zero com dados reais da Wikipedia (recomendado):

```bash
python scripts/ingest_wikipedia.py              # baixa dados reais da Wikipedia (~1500 exemplos, 10 categorias tech)
python scripts/train.py                         # treina e salva models/modelo.joblib + models/vectorizer.joblib
```

Para treinar com dados sintéticos (legado):

```bash
python scripts/generate_realistic_dataset.py    # gera dataset com exemplos sintéticos
python scripts/train.py                         # treina e salva os artefatos
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
│   ├── model_loader.py           # download do OCI + carga dos artefatos .joblib (paths absolutos, timeout 30s)
│   ├── keywords.py               # extração de palavras-chave com fallback decision_function/predict_proba
│   └── logging_config.py         # formatter JSON estruturado para logs de produção
├── scripts/
│   ├── generate_realistic_dataset.py  # gera dataset sintético (legado)
│   ├── ingest_wikipedia.py            # gera dataset real via Wikipedia API (~1500 exemplos, 10 categorias tech) ⭐
│   ├── train.py                   # treina o pipeline (TF-IDF + LogisticRegression) e salva métricas
│   ├── evaluate.py                # testa o modelo salvo manualmente via input no terminal
│   └── upload_to_oci.py           # upload dos artefatos .joblib para OCI Object Storage
├── tests/
│   ├── __init__.py
│   └── test_predict.py            # suite de testes pytest (8 testes: validação, schemas, keywords)
├── data/
│   └── dataset.csv                # dataset principal (1481 exemplos, 10 categorias tech, Wikipedia)
├── models/
│   ├── modelo.joblib              # classificador LogisticRegression serializado
│   ├── vectorizer.joblib           # vetorizador TF-IDF serializado
│   └── metrics.json               # métricas de avaliação (precision, recall, f1)
├── config.yaml                    # hiperparâmetros do TF-IDF / LogisticRegression + stopwords pt
├── requirements.txt
├── requirements-dev.txt   # dependências para o notebook (matplotlib, seaborn, jupyter)
├── Dockerfile                    # HEALTHCHECK via curl /health, python:3.11-slim, 4 workers
└── .env.example
```


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
  "probabilidade": 0.89,
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
  "status": "healthy",
  "model_loaded": true
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
python scripts/upload_to_oci.py
```

Ou via OCI CLI:

```bash
oci os object put --bucket-name techknowledge-models --file models/modelo.joblib --name modelo.joblib
oci os object put --bucket-name techknowledge-models --file models/vectorizer.joblib --name vectorizer.joblib
```

Mais contexto (estratégia de ciência de dados): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 13 e 16.
