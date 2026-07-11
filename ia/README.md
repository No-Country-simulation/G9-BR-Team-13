# ia/

Notebook de Ciência de Dados (treino do modelo) + serviço interno de inferência (FastAPI), chamado pelo backend Java via `POST /predict`.

## Stack

- Python 3.11
- Scikit-Learn (`TfidfVectorizer` + `LogisticRegression`)
- FastAPI
- `joblib` para serializar modelo e vetorizador

## Como começar

Dentro desta pasta:

```bash
python -m venv .venv
.venv\Scripts\activate      # Windows
pip install fastapi uvicorn scikit-learn pandas joblib
pip freeze > requirements.txt
```

## Estrutura esperada

```
ia/
├── notebooks/
│   └── eda_treino_modelo.ipynb   # EDA, limpeza, TF-IDF, treino, métricas, serialização (entregável obrigatório)
├── app/
│   ├── main.py          # FastAPI app, endpoint POST /predict
│   ├── model_loader.py  # carrega modelo.joblib e vectorizer.joblib UMA VEZ na subida do processo
│   ├── schemas.py        # Pydantic (request/response) — nunca use dict solto
│   └── keywords.py       # extração de palavras-chave via maiores pesos TF-IDF do texto recebido
├── models/
│   ├── modelo.joblib
│   └── vectorizer.joblib
└── requirements.txt
```

## Regras importantes

- O modelo e o vetorizador são carregados **uma única vez** na inicialização do processo, nunca a cada requisição.
- `models/*.joblib` não vai para o Git (está no `.gitignore` da raiz) — o artefato final é publicado no OCI Object Storage.
- Depois de treinar, o script/notebook faz upload de `modelo.joblib` e `vectorizer.joblib` para o bucket do Object Storage.

Mais contexto (estratégia de ciência de dados, contrato do `/predict`): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 13 e 16.
