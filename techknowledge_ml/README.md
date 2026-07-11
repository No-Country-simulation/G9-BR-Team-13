# TechKnowledge AI - Serviço de Machine Learning

## Objetivo

Este projeto implementa o serviço de Inteligência Artificial da plataforma **TechKnowledge**.

Sua responsabilidade é realizar a classificação de conteúdos técnicos utilizando Machine Learning e disponibilizar essa funcionalidade através de uma API REST construída com **FastAPI**.

Este serviço faz parte da arquitetura de microsserviços do projeto final e será consumido pelo Backend desenvolvido em **Java + Spring Boot**, que por sua vez será utilizado pelo Frontend desenvolvido em **React + Tailwind CSS**.

---

# Arquitetura Geral

```text
                    React + Tailwind

                           │

                    HTTP REST (JSON)

                           │

                    Spring Boot API

                           │

              POST /predict (HTTP)

                           │

                FastAPI (Python)

                           │

              Pipeline Machine Learning

                           │

                Modelo Treinado (.pkl)

                           │

             Classificação do Conteúdo
```

---

# Papel deste Serviço

Este microsserviço é responsável exclusivamente por:

- Receber textos enviados pelo Backend
- Processar os dados utilizando o modelo treinado
- Classificar o conteúdo
- Calcular a probabilidade da classificação
- Extrair palavras-chave
- Retornar um JSON para o Backend

Toda autenticação, autorização, persistência de dados e regras de negócio permanecem no Backend Spring Boot.

---

# Fluxo da Aplicação

```text
Usuário

↓

Frontend React

↓

Spring Boot

↓

POST /predict

↓

FastAPI

↓

Modelo ML

↓

Resposta JSON

↓

Spring Boot

↓

Frontend
```

---

# Stack Tecnológica

## Machine Learning

- Python 3.11
- Scikit-Learn
- Pandas
- NumPy
- Joblib

## API

- FastAPI
- Uvicorn
- Pydantic

## Infraestrutura

- Docker
- Oracle Cloud Infrastructure
- Oracle Object Storage

---

# Estrutura do Projeto

```text
techknowledge_ml/

├── app/
│   ├── __init__.py
│   ├── main.py
│   └── utils.py
│
├── data/
│   └── dataset.csv
│
├── models/
│   ├── pipeline_classificador.pkl
│   └── metrics.json
│
├── scripts/
│   ├── generate_data.py
│   ├── train.py
│   └── evaluate.py
│
├── config.yaml
├── Dockerfile
├── requirements.txt
└── README.md
```

---

# Ambiente de Desenvolvimento

## Requisitos

- Python 3.11
- pip
- virtualenv

---

## Criar ambiente virtual

Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

Linux/macOS

```bash
python3 -m venv .venv

source .venv/bin/activate
```

---

## Instalar dependências

```bash
pip install -r requirements.txt
```

---

# Dataset

Para gerar um dataset sintético:

```bash
python scripts/generate_data.py
```

O script gera dois arquivos:

```
dataset_200.csv

dataset_400.csv
```

Renomear o dataset escolhido para:

```
data/dataset.csv
```

---

# Treinamento

Executar:

```bash
python scripts/train.py
```

Arquivos gerados:

```
models/pipeline_classificador.pkl

models/metrics.json
```

O arquivo **pipeline_classificador.pkl** é utilizado pela API durante a inferência.

---

# Executando a API

```bash
uvicorn app.main:app --reload --port 8000
```

API disponível em

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/docs
```

---

# Contrato da API

## Endpoint

```
POST /predict
```

---

## Request

```json
{
    "titulo":"Spring Boot Avançado",
    "texto":"Construção de microserviços utilizando Spring Cloud."
}
```

---

## Response

```json
{
    "categoria":"Backend",
    "probabilidade":0.94,
    "palavrasChave":[
        "spring",
        "boot",
        "cloud",
        "microservices"
    ]
}
```

---

# Categorias Suportadas

O modelo atualmente classifica os seguintes domínios:

- Backend
- Frontend
- DevOps
- Data Science

Novas categorias exigem novo treinamento do modelo.

---

# Integração com o Backend

O Backend Java deverá consumir o endpoint:

```
POST /predict
```

Exemplo de configuração:

```properties
ml.service.url=http://localhost:8000/predict
```

Fluxo esperado:

```text
Controller

↓

Service

↓

RestTemplate/WebClient

↓

FastAPI

↓

JSON

↓

Service

↓

Controller
```

A responsabilidade do Backend é:

- validar entrada
- autenticar usuário
- persistir dados
- chamar o serviço ML
- devolver resposta ao Frontend

---

# Integração com o Frontend

O Frontend **não deve consumir este serviço diretamente**.

Fluxo correto:

```text
React

↓

Spring Boot

↓

FastAPI
```

Isso garante:

- autenticação centralizada
- regras de negócio
- isolamento do serviço ML
- facilidade de substituição futura

---

# Docker

## Build

```bash
docker build -t techknowledge-ml:v1 .
```

## Run

```bash
docker run -d \
-p 8000:8000 \
--name techknowledge-ml \
techknowledge-ml:v1
```

---

# Deploy OCI

Em produção o modelo é carregado automaticamente do Object Storage.

Variáveis necessárias:

```
OCI_BUCKET_NAME

OCI_NAMESPACE

MODEL_OBJECT_NAME
```

---

# Responsabilidades

## Frontend

- Interface
- Consumo da API Spring
- Exibição dos resultados

---

## Backend

- Segurança
- JWT
- Persistência
- Regras de negócio
- Comunicação com o serviço ML

---

## Serviço ML

- Classificação
- Inferência
- Extração de palavras-chave
- Probabilidade

---

# Convenções

Todas as comunicações utilizam:

```
Content-Type:

application/json
```

Codificação:

```
UTF-8
```

---

# Roadmap

Melhorias previstas:

- Suporte a novos modelos
- Versionamento do modelo
- Cache das inferências
- Métricas Prometheus
- Health Check
- Logs estruturados
- Testes automatizados
- Pipeline CI/CD

---

# Observações

Este projeto deve permanecer desacoplado do Backend.

Toda comunicação deve ocorrer exclusivamente via HTTP REST.

O serviço foi projetado para permitir substituição futura do modelo de Machine Learning sem impacto no Backend ou Frontend, desde que o contrato da API seja mantido.