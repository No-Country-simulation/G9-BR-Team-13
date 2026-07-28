# Análise da IA — Python / FastAPI / Scikit-Learn

**Data:** 27/07/2026
**Stack:** Python 3.11, FastAPI, Scikit-Learn (TF-IDF + LogisticRegression), joblib, OCI SDK

---

## 1. Estrutura de Arquivos

```
ia/
├── config.yaml                 # Hiperparâmetros + stopwords PT
├── Dockerfile                  # python:3.11-slim, uvicorn porta 8000
├── requirements.txt            # Produção
├── requirements-dev.txt        # Desenvolvimento
├── .env.example                # OCI_BUCKET_NAME, OCI_NAMESPACE, PORT
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app, POST /predict + GET /categorias + GET /health
│   ├── model_loader.py         # Carrega .joblib do disco ou OCI Object Storage
│   ├── schemas.py              # Pydantic: TextInput, PredictionOutput
│   └── keywords.py             # Extração de keywords via coeficientes
├── data/
│   └── dataset.csv             # 597 exemplos reais, 10 categorias (Wikipedia)
├── models/
│   ├── metrics.json             # Acurácia 93.3%, F1-weighted 93.3%
│   ├── modelo.joblib            # ✅ LogisticRegression treinado
│   └── vectorizer.joblib        # ✅ TfidfVectorizer treinado
├── notebooks/
│   └── eda_treino_modelo.ipynb  # EDA + treino + avaliação
└── scripts/
    ├── train.py                 # Pipeline de treino com GridSearchCV
    ├── evaluate.py              # Teste manual do modelo
    ├── generate_realistic_dataset.py  # Gera dataset sintético (legado)
    ├── ingest_wikipedia.py      # Gera dataset real via Wikipedia API ✅ NOVO
    └── upload_to_oci.py         # Upload dos artefatos para OCI
```

---

## 2. O que está Implementado ✅

| Componente | Arquivo | Detalhe |
|---|---|---|
| EDA + Treino em Notebook | `notebooks/eda_treino_modelo.ipynb` | Completo com visualizações |
| Pipeline de treino | `scripts/train.py` | TF-IDF + LogisticRegression + GridSearchCV |
| Geração de dataset sintético | `scripts/generate_realistic_dataset.py` | 630 exemplos sintéticos (legado) |
| **Ingestão de dados reais** | **`scripts/ingest_wikipedia.py`** | **597 exemplos reais da Wikipedia API, 10 categorias** |
| FastAPI `/predict` | `app/main.py` | POST com asynccontextmanager (lifespan) |
| FastAPI `/categorias` | `app/main.py` | Lista as 10 categorias suportadas |
| FastAPI `/health` | `app/main.py` | Liveness probe com status do modelo |
| Schemas Pydantic | `app/schemas.py` | `TextInput` e `PredictionOutput` |
| Validação de entrada | `app/schemas.py` | `Field(min_length=3, max_length=200)` |
| Model Loader com OCI | `app/model_loader.py` | Resource Principals + fallback config file |
| Extração keywords | `app/keywords.py` | Pesos TF-IDF × coeficientes LogReg |
| Config externalizada | `config.yaml` | Stopwords PT, hiperparâmetros |
| Dockerfile com HEALTHCHECK | `Dockerfile` | python:3.11-slim, 4 workers |
| Logging JSON | `app/logging_config.py` | Formato estruturado para produção |
| Testes pytest | `tests/test_predict.py` | 8 testes unitários |
| Upload OCI | `scripts/upload_to_oci.py` | Upload dos artefatos treinados |
| Métricas salvas | `models/metrics.json` | Classification report completo |

---

## 3. O que Falta (crítico — P0)

Todos os itens P0 identificados anteriormente foram resolvidos:

| Item | Status |
|---|---|
| Modelos serializados | ✅ Gerados por `scripts/train.py` |
| Inconsistência treino vs inferência | ✅ Ambos concatenam `titulo + texto` |
| Validação de entrada | ✅ `Field(min_length=3, max_length=200)` nos schemas |
| Endpoints faltantes | ✅ `GET /categorias` e `GET /health` implementados |
| Testes | ✅ 8 testes pytest em `tests/test_predict.py` |

---

## 4. Qualidade do Dataset

### 4.1 Métricas atuais (do `metrics.json`) — Dataset Wikipedia

| Categoria | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| Backend | 0.91 | 0.83 | 0.87 | 12 |
| Dados | 0.75 | 0.75 | 0.75 | 12 |
| DevOps | 1.00 | 0.92 | 0.96 | 12 |
| Direito | 1.00 | 1.00 | 1.00 | 12 |
| Educacao | 0.91 | 0.83 | 0.87 | 12 |
| Financas | 1.00 | 1.00 | 1.00 | 12 |
| Frontend | 0.86 | 1.00 | 0.92 | 12 |
| Marketing | 1.00 | 1.00 | 1.00 | 12 |
| Outros | 1.00 | 1.00 | 1.00 | 12 |
| Saude | 0.92 | 1.00 | 0.96 | 12 |
| **Acurácia** | | | **0.933** | 120 |

### 4.2 Problemas identificados (resolvidos)

| Problema | Status |
|---|---|
| **Textos sintéticos** | ✅ **Resolvido** — agora usa dados reais da Wikipedia |
| **Comprimento uniforme** | ✅ **Resolvido** — média de ~1333 caracteres (vs 180 antes) |
| **Amostra de teste pequena** | ✅ **Resolvido** — 120 registros de teste (vs 40) |
| **Sem variação de vocabulário** | ✅ **Resolvido** — Wikipedia tem vocabulário diverso por domínio |
| **Modelo aprendia formato, não semântica** | ✅ **Resolvido** — dados reais têm variação natural |

### 4.3 Problemas ainda abertos

| Problema | Detalhe |
|---|---|
| **Dataset Wikipedia é enciclopédico** | Texto formal, não reflete linguagem coloquial de documentos reais |
| **Dados desbalanceados por categoria** | Algumas categorias têm 58 vs 60 exemplos (diferença pequena) |
| **Apenas LogisticRegression** | Modelo linear com TF-IDF tem limite de captura semântica |
| **Sem dados de produção** | Feedback loop humano não implementado para capturar dados reais de uso |

---

## 5. O que Melhorar (médio — P1)

| Item | Local | Problema | Sugestão |
|---|---|---|---|
| Paths relativos ✅ | `model_loader.py` | Quebra se CWD ≠ `ia/` | Usar `Path(__file__).resolve().parent.parent` |
| Sem script upload OCI ✅ | `scripts/` | Não há automatização de upload | Criar `scripts/upload_to_oci.py` |
| Logging básico ✅ | `main.py` | Só `logging.basicConfig` | Formato JSON para produção |
| CORS ausente ✅ | `main.py` | `CORSMiddleware` não configurado | Adicionar middleware |
| keywords frágil ✅ | `keywords.py` | Assume `decision_function` existe | Verificar com `hasattr` |
| Nome do arquivo salvo ✅ | `train.py` / notebook | Notebook salva `pipeline_classificador.pkl`, script salva separado | Unificar nomenclatura |
| Sem `OCI_REGION` ✅ | `model_loader.py` | Pode falhar com Resource Principal | Adicionar parâmetro de região |
| Sem timeout download ✅ | `model_loader.py` | Download OCI sem timeout | Adicionar timeout |

---

## 6. Ingestão de Dados da Wikipedia

### 6.1 Script `scripts/ingest_wikipedia.py`

Criado para substituir a geração de dados sintéticos por dados reais da Wikipedia em português.

**Fluxo:**
```
Wikipedia API → busca por categoria → extratos em lote → dataset.csv → train.py
```

**Estratégia de API:**
1. Para cada categoria, percorre termos de busca definidos em `CATEGORY_SEARCH_TERMS`
2. Para cada termo, usa `action=query + list=search` para obter títulos de artigos
3. Coleta todos os títulos únicos encontrados em todos os termos da categoria
4. Obtém extratos em lote com `action=query + titles=A|B|C + prop=extracts + exintro=1 + explaintext=1`
5. Gera variações de comprimento (curto/médio/longo) para cada artigo

**Cobertura atual:** 10 categorias, ~20 artigos cada, ~600 exemplos totais

### 6.2 Por que Wikipedia e não outra API

| API | Motivo da escolha / rejeição |
|---|---|
| **Wikipedia API** | ✅ Grátis, sem chave, português nativo, 10+ domínios |
| Hugging Face Datasets | ❌ Poucos datasets em PT para domínios não-técnicos |
| NewsAPI | ❌ Requer API key, maioria em inglês |
| PubMed | ❌ Só saúde/inglês |

### 6.3 Como usar

```bash
cd ia
python scripts/ingest_wikipedia.py    # gera data/dataset.csv com dados reais
python scripts/train.py               # re-treina o modelo
```

## 8. Notebook vs Scripts — Divergências

| Aspecto | Notebook | `train.py` |
|---|---|---|
| Saída serializada | `vectorizer.joblib` + `modelo.joblib` | `vectorizer.joblib` + `modelo.joblib` |
| Coluna `titulo` | ✅ Concatena `titulo + texto` | ✅ Concatena `titulo + texto` |
| Hiperparâmetros | Lê do `config.yaml` | Lê do `config.yaml` |

O notebook e o script agora estão alinhados: ambos salvam `vectorizer.joblib` + `modelo.joblib` e concatenam `titulo + texto`.

---

## 9. Dockerfile

**`ia/Dockerfile`:**
- Base: `python:3.11-slim`
- Porta: 8000
- Workers: 4 (`uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`)
- **Problema:** ~~Sem `HEALTHCHECK`~~ ✅ Corrigido, sem `CMD` alternativo, sem `.dockerignore`

---

## 10. Prioridades de Correção

| Prio | O que fazer | Esforço |
|---|---|---|
| **P0** | Rodar `python scripts/train.py` para gerar modelos | ✅ Feito |
| **P0** | Corrigir `train.py` para concatenar `titulo + texto` | ✅ Feito |
| **P0** | Adicionar `Field(min_length=..., max_length=...)` nos schemas | ✅ Feito |
| **P0** | Adicionar `GET /categorias` e `GET /health` | ✅ Feito |
| **P1** | Adicionar testes com pytest | ✅ Feito |
| **P1** | Criar `scripts/upload_to_oci.py` | ✅ Feito |
| **P1** | Adicionar CORS middleware | ✅ Feito |
| **P1** | Corrigir paths relativos em `model_loader.py` | ✅ Feito |
| **P1** | Expandir dataset (500+ exemplos, mais variação) | ✅ Feito |
| **P1** | **Criar ingestão de dados reais (Wikipedia API)** | ✅ **Feito** |
| **P2** | Logging estruturado (JSON) | ✅ Feito |
| **P2** | Adicionar `HEALTHCHECK` no Dockerfile | ✅ Feito |
| **P1** | Unificar nomenclatura notebook vs script | ✅ Feito |

### Próximos passos sugeridos

| Prio | O que fazer | Motivo |
|---|---|---|
| **P2** | Feedback loop humano | Salvar predições para revisão e re-treino incremental |
| **P2** | Migrar para embeddings (Sentence-BERT) | Melhor captura semântica que TF-IDF |
| **P3** | Adicionar mais fontes de dados reais | The Guardian API, dados de produção |
| **P3** | Implementar Active Learning | Reduzir necessidade de anotação manual |
