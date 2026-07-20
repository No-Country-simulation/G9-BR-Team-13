# ia/

Serviço de Ciência de Dados / Machine Learning: treina o modelo de classificação de conteúdo técnico e expõe um serviço interno de inferência (FastAPI) chamado pelo backend Java via `POST /predict`.

## Stack

- Python 3.11, FastAPI, Scikit-Learn, `joblib`
- Algoritmo: TF-IDF + **LogisticRegression** (multinomial, `predict_proba` nativo)
- Stopwords: **português** (lista curada inline no `config.yaml`)
- OCI Object Storage (`app/model_loader.py` baixa os artefatos de lá se `OCI_NAMESPACE` estiver configurado; roda localmente sem OCI se `models/modelo.joblib` e `models/vectorizer.joblib` já existirem)

## Status

- **Modelo treinado:** TF-IDF + LogisticRegression (multinomial)
- **Acurácia atual:** ~75-95% (F1-weighted: ~0.75-0.95, varia conforme amostragem do dataset)
- **Stopwords:** português (lista curada no `config.yaml`)
- **Contrato:** campo `informacoes_adicionais` conforme seção 14.2 do doc
- **Dataset:** 200 exemplos realistas de documentação técnica (50 por categoria, 4 categorias), gerados por `scripts/generate_realistic_dataset.py`

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
python scripts/generate_realistic_dataset.py   # gera dataset com exemplos realistas (preferencial)
python scripts/train.py                        # treina e salva models/modelo.joblib + models/vectorizer.joblib
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
│   ├── main.py                   # FastAPI app, endpoint POST /predict
│   ├── schemas.py                # Pydantic models (TextInput, PredictionOutput)
│   ├── model_loader.py           # download do OCI + carga dos artefatos .joblib
│   └── keywords.py               # extração de palavras-chave a partir dos coeficientes do classificador
├── scripts/
│   ├── generate_realistic_dataset.py  # gera dataset com exemplos realistas de documentação técnica
│   ├── train.py                   # treina o pipeline (TF-IDF + LogisticRegression) e salva métricas
│   └── evaluate.py                # testa o modelo salvo manualmente via input no terminal
├── data/
│   └── dataset.csv                # dataset principal (200 exemplos realistas)
├── models/
│   ├── modelo.joblib              # classificador LogisticRegression serializado
│   ├── vectorizer.joblib           # vetorizador TF-IDF serializado
│   └── metrics.json
├── config.yaml                    # hiperparâmetros do TF-IDF / LogisticRegression + stopwords pt
├── requirements.txt
├── requirements-dev.txt   # dependências para o notebook (matplotlib, seaborn, jupyter)
├── Dockerfile
└── .env.example
```


## Contrato do endpoint

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

O campo `informacoes_adicionais` segue o contrato oficial da seção 14.2 de [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md).

## Regras importantes

- O modelo é carregado **uma única vez** na inicialização do processo (`lifespan`), nunca a cada requisição.
- `.env` real (com credenciais) nunca vai para o Git — só `.env.example`. `.venv/`, `__pycache__/` e `*.pyc` já estão no `.gitignore` da raiz.

Mais contexto (estratégia de ciência de dados): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 13 e 16.
