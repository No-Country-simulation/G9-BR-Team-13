# Análise da IA — Python / FastAPI / Scikit-Learn

**Data:** 21/07/2026
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
│   ├── main.py                 # FastAPI app, POST /predict
│   ├── model_loader.py         # Carrega .joblib do disco ou OCI Object Storage
│   ├── schemas.py              # Pydantic: TextInput, PredictionOutput
│   └── keywords.py             # Extração de keywords via coeficientes
├── data/
│   └── dataset.csv             # 200 exemplos, 4 categorias, 50 cada
├── models/
│   ├── metrics.json             # Acurácia 80%, F1-weighted 79.8%
│   ├── modelo.joblib            # ❌ NÃO EXISTE
│   └── vectorizer.joblib        # ❌ NÃO EXISTE
├── notebooks/
│   └── eda_treino_modelo.ipynb  # EDA + treino + avaliação
└── scripts/
    ├── train.py                 # Pipeline de treino com GridSearchCV
    ├── evaluate.py              # Teste manual do modelo
    └── generate_realistic_dataset.py  # Gera dataset sintético
```

---

## 2. O que está Implementado ✅

| Componente | Arquivo | Detalhe |
|---|---|---|
| EDA + Treino em Notebook | `notebooks/eda_treino_modelo.ipynb` | Completo com visualizações |
| Pipeline de treino | `scripts/train.py` | TF-IDF + LogisticRegression + GridSearchCV |
| Geração de dataset | `scripts/generate_realistic_dataset.py` | 200 exemplos balanceados |
| FastAPI `/predict` | `app/main.py` | POST com asynccontextmanager (lifespan) |
| Schemas Pydantic | `app/schemas.py` | `TextInput` e `PredictionOutput` |
| Model Loader com OCI | `app/model_loader.py` | Resource Principals + fallback config file |
| Extração keywords | `app/keywords.py` | Pesos TF-IDF × coeficientes LogReg |
| Config externalizada | `config.yaml` | Stopwords PT, hiperparâmetros |
| Dockerfile | `Dockerfile` | python:3.11-slim, 4 workers |
| Métricas salvas | `models/metrics.json` | Classification report completo |

---

## 3. O que Falta (crítico — P0)

### 3.1 Modelos serializados NÃO EXISTEM 🚨

```
models/modelo.joblib      → ❌ AUSENTE
models/vectorizer.joblib  → ❌ AUSENTE
```

O serviço FastAPI **quebra ao iniciar** — `model_loader.load_artefatos()` tentará carregar de disco, não encontrará, tentará baixar do OCI (que também não tem), e lançará exceção.

**Ação imediata:** Executar `python scripts/train.py` para gerar os arquivos.

### 3.2 Inconsistência treino vs inferência

| Pipeline | Usa coluna `titulo`? |
|---|---|
| **Treino** (`train.py`) | ❌ **NÃO** — só lê `texto` |
| **Inferência** (`main.py`) | ✅ **SIM** — concatena `f"{titulo} {texto}"` |

O dataset tem 3 colunas (`titulo`, `texto`, `categoria`), mas o treino ignora `titulo`. Isso degrada a qualidade da predição porque o vocabulário do título não é aprendido.

**Correção:** Modificar `train.py` para concatenar `titulo + " " + texto` como feature, consistente com a inferência.

### 3.3 Validação de entrada ausente

`TextInput` em `schemas.py` não tem constraints:

```python
class TextInput(BaseModel):
    titulo: str          # Sem Field(min_length=3, max_length=200)
    texto: str           # Sem Field(min_length=20, max_length=5000)
```

Campos vazios e textos muito curtos são aceitos. A seção 14.3 exige validação.

### 3.4 Endpoints faltantes

| Endpoint | Previsto | Implementado |
|---|---|---|
| `POST /predict` | Contrato interno | ✅ |
| `GET /categorias` | Seção 14.1 | ❌ |
| `GET /health` | Boa prática (liveness) | ❌ |

### 3.5 Sem testes

Nenhum arquivo `test_*.py`. O pytest não está configurado.

---

## 4. Qualidade do Dataset

### 4.1 Métricas atuais (do `metrics.json`)

| Categoria | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| Backend | 0.78 | 0.70 | 0.74 | 10 |
| Dados | 0.90 | 0.90 | 0.90 | 10 |
| DevOps | 0.82 | 0.90 | 0.86 | 10 |
| Frontend | 0.70 | 0.70 | 0.70 | 10 |
| **Acurácia** | | | **0.80** | 40 |

### 4.2 Problemas identificados

| Problema | Detalhe |
|---|---|
| **Textos sintéticos** | Gerados por script, seguem template: "X é uma ferramenta que..." |
| **Comprimento uniforme** | ~180 caracteres cada (mínimo para TF-IDD seria ~500) |
| **Amostra de teste pequena** | Apenas 40 registros (10 por classe) — 1 erro muda 10% da métrica |
| **Sem variação de vocabulário** | Estrutura repetitiva entre categorias |
| **Modelo pode aprender formato, não semântica** | Risco alto de não generalizar para textos reais |

### 4.3 Recomendações

- Aumentar para 500-1000 exemplos
- Adicionar variedade de comprimento (50-5000 caracteres)
- Usar `titulo` no treino
- Adicionar exemplos de categorias fora das 4 suportadas
- Adicionar exemplos ambíguos (ruído controlado)

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

## 6. Notebook vs Scripts — Divergências

| Aspecto | Notebook | `train.py` |
|---|---|---|
| Saída serializada | `vectorizer.joblib` + `modelo.joblib` | `vectorizer.joblib` + `modelo.joblib` |
| Coluna `titulo` | ✅ Concatena `titulo + texto` | ✅ Concatena `titulo + texto` |
| Hiperparâmetros | Lê do `config.yaml` | Lê do `config.yaml` |

O notebook e o script agora estão alinhados: ambos salvam `vectorizer.joblib` + `modelo.joblib` e concatenam `titulo + texto`.

---

## 7. Dockerfile

**`ia/Dockerfile`:**
- Base: `python:3.11-slim`
- Porta: 8000
- Workers: 4 (`uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`)
- **Problema:** ~~Sem `HEALTHCHECK`~~ ✅ Corrigido, sem `CMD` alternativo, sem `.dockerignore`

---

## 8. Prioridades de Correção

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
| **P2** | Logging estruturado (JSON) | ✅ Feito |
| **P2** | Adicionar `HEALTHCHECK` no Dockerfile | ✅ Feito |
| **P1** | Unificar nomenclatura notebook vs script | ✅ Feito |
