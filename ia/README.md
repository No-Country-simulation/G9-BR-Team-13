# ia/

Serviço de Ciência de Dados / Machine Learning: treina o modelo de classificação de conteúdo técnico e expõe um serviço interno de inferência (FastAPI) chamado pelo backend Java via `POST /predict`.

## Status atual

Já existe código real aqui (recuperado da branch `marcusdev/ml`, removendo uma pasta `.venv` que tinha sido commitada por engano). **Antes de usar como está, o time de Dados precisa resolver os pontos abaixo** — nenhum é um bug de sintaxe, são decisões/qualidade que afetam o resultado:

1. **Dataset sintético.** `data/dataset.csv` (400 linhas) foi gerado por template (`scripts/generate_data.py` combina prefixo + tema + sufixo de listas fixas por categoria), não é conteúdo técnico real. Isso explica o F1-score de 1.0 em `models/metrics.json` — é sinal de que o modelo decorou o vocabulário do template, não de que ele generaliza bem. Precisa complementar/substituir por exemplos reais antes da entrega (ver seção 13 da documentação).
2. **Falta o notebook.** O edital exige um notebook de Ciência de Dados (EDA, limpeza, treino, métricas, serialização) como entregável obrigatório. O pipeline aqui está em scripts `.py` (`scripts/train.py`, `scripts/evaluate.py`) — funcional, mas precisa ser consolidado em um notebook (`notebooks/eda_treino_modelo.ipynb`) para cumprir o requisito literal do edital.
3. **Algoritmo.** `scripts/train.py` usa `LinearSVC`. A documentação e o edital sugerem `LogisticRegression`. A "probabilidade" retornada hoje é uma aproximação manual (softmax sobre `decision_function`), não uma probabilidade calibrada de verdade. Vale decidir com o time se troca para `LogisticRegression` (tem `predict_proba` nativo) ou se mantém `LinearSVC` documentando a aproximação.
4. **Stopwords erradas.** `config.yaml` está configurado com `stop_words: "english"`, mas o texto é em português — na prática isso não filtra quase nada.
5. **Contrato do endpoint.** `app/main.py` já implementa `POST /predict` de acordo com o padrão do doc (título+texto → categoria+probabilidade+palavras-chave), mas o campo de resposta se chama `palavrasChave` — confirmar com o Backend antes de integrar, e ver seção 14.2 do doc para o contrato final exposto ao usuário (que usa `informacoes_adicionais`). Um arquivo `Integração_Backend.md` que vinha junto com esse código sugeria um endpoint público (`/api/v1/classify`) diferente do contrato oficial (`POST /conteudo`) — não foi trazido para o repositório por causa disso; **não usem ele como referência**, o contrato oficial é a seção 14 do [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md).

## Stack

- Python 3.11, FastAPI, Scikit-Learn, `joblib`
- OCI Object Storage (`app/main.py` já baixa o modelo de lá se `OCI_NAMESPACE` estiver configurado; roda localmente sem OCI se `models/pipeline_classificador.pkl` já existir)

## Como rodar localmente

```bash
cd ia
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env          # ajuste as variáveis se for usar OCI
uvicorn app.main:app --reload --port 8000
```

Para treinar o modelo do zero: `python scripts/train.py` (lê `data/dataset.csv`, salva `models/pipeline_classificador.pkl` e `models/metrics.json`).

## Estrutura

```
ia/
├── app/
│   ├── main.py       # FastAPI app, endpoint POST /predict, download do modelo via OCI
│   └── utils.py       # extração de palavras-chave a partir dos coeficientes do classificador
├── scripts/
│   ├── generate_data.py   # gera dataset sintético (ver ressalva nº 1 acima)
│   ├── train.py            # treina o pipeline (TF-IDF + LinearSVC) e salva métricas
│   └── evaluate.py         # testa o modelo salvo manualmente via input no terminal
├── data/
│   └── dataset.csv, dataset_200.csv, dataset_400.csv
├── models/
│   ├── pipeline_classificador.pkl   # modelo + vetorizador num único objeto sklearn Pipeline
│   └── metrics.json
├── config.yaml         # hiperparâmetros do TF-IDF/SVC
├── requirements.txt
├── Dockerfile
└── .env.example
```

> Nota: o doc oficial (seção 5) sugere separar `modelo.joblib` e `vectorizer.joblib` e ter uma pasta `notebooks/`. O que existe hoje empacota os dois num único `Pipeline` serializado e usa scripts em vez de notebook — funcionalmente equivalente, mas pendente dos ajustes 1–3 acima e da criação do notebook para bater com o entregável do edital.

## Regras importantes

- O modelo é carregado **uma única vez** na inicialização do processo (`@app.on_event("startup")`), nunca a cada requisição.
- `.env` real (com credenciais) nunca vai para o Git — só `.env.example`. `.venv/`, `__pycache__/` e `*.pyc` já estão no `.gitignore` da raiz.

Mais contexto (estratégia de ciência de dados, contrato do `/predict`): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 13 e 16.
