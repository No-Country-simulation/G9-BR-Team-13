# 🚀 Time 13 - Organização Inteligente de Conteúdo Técnico

<div align="center">

# 🧠 TechMind

### 🚀 Hackathon ONE | Alura + Oracle

### 👥 Grupo G9 • Time 13

**Transformando conteúdos técnicos em conhecimento organizado através da Inteligência Artificial.**

---

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Oracle Cloud](https://img.shields.io/badge/Oracle%20Cloud-OCI-red)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED)

</div>

---

# 🌟 Sobre o Projeto

O **TechMind** é uma solução desenvolvida durante o **Hackathon ONE (Oracle + Alura)** com o objetivo de organizar automaticamente conteúdos técnicos utilizando técnicas de **Ciência de Dados** e **Machine Learning**.

A plataforma recebe um conteúdo composto por um **título** e um **texto**, analisa essas informações e devolve uma resposta estruturada em formato **JSON**, permitindo que outras aplicações utilizem os resultados.

## 🎯 Principais funcionalidades

* 🤖 Classificação automática de conteúdos técnicos (10 categorias)
* 📊 Cálculo da probabilidade da classificação
* 🔍 Extração de palavras-chave relevantes, com peso de explicabilidade por termo
* 💾 Persistência do histórico das análises
* 🔎 Busca por palavra-chave na Base de Conhecimento
* ☁️ Integração com Oracle Cloud Infrastructure (OCI)
* 🔗 API REST para integração com outros sistemas

## 2. Arquitetura

O Frontend (React) fala só com o Backend (Java/Spring Boot), nunca diretamente com o serviço de ML. O Backend valida a entrada, chama o serviço de ML (Python/FastAPI) via HTTP interno, formata a resposta no contrato do edital e grava o histórico no banco (PostgreSQL) sem bloquear a resposta ao usuário. O modelo (`.joblib`) é publicado no OCI Object Storage e a aplicação roda em containers Docker numa instância OCI Compute. Detalhes completos do fluxo: seção 3 da [documentação](docs/DOCUMENTACAO_PROJETO.md).

🔗 **Aplicação no ar**: [tech-mind.duckdns.org](https://tech-mind.duckdns.org)

## 3. Estrutura do monorepo

```
G9-BR-Team-13/
├── frontend/   # React + Vite - consome só o Backend, nunca o ML Service direto
├── backend/    # Java 17 + Spring Boot - API pública, validação, persistência
├── ia/         # Python + FastAPI + Scikit-Learn — notebook de treino e serviço de inferência
├── infra/      # aponta para onde a infraestrutura (Docker Compose, deploy) realmente vive no repositório
├── scripts/    # scripts de Docker Compose (dev/prod), testes e deploy na OCI
├── docs/       # documentação completa do projeto
├── README.md         # este arquivo
└── CONTRIBUTING.md    # fluxo de branches, commits e Pull Requests
```

Cada pasta (`frontend/`, `backend/`, `ia/`, `infra/`) tem seu próprio README com detalhes de como rodar e a estrutura interna daquela área.

## 4. Como executar localmente

### Opção recomendada: Docker Compose (sobe tudo de uma vez)

Pré-requisitos: Docker e Docker Compose instalados.

```bash
cp .env.example .env.dev   # ajuste as variáveis se quiser valores diferentes dos padrões
./scripts/dev.sh
```

Isso sobe PostgreSQL, backend, serviço de IA e frontend juntos, com hot reload. Backend em `http://localhost:8080`, frontend em `http://localhost:5173` (ver [`scripts/README.md`](scripts/README.md) para os demais scripts disponíveis: `test.sh`, `build.sh`, `stop.sh`, `clean.sh`).

### Opção manual (serviço por serviço)

Cada pasta tem instruções próprias de execução sem Docker: [`backend/README.md`](backend/README.md), [`frontend/README.md`](frontend/README.md), [`ia/README.md`](ia/README.md).

## 5. Como usar a API

Ver especificação completa (endpoints, contrato de request/response, validações, códigos de erro) na seção 14 de [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md).

Classificar um conteúdo novo:

```
POST /conteudo
Request:  { "titulo": "...", "texto": "..." }
Response: { "categoria": "Backend", "probabilidade": 0.89, "informacoes_adicionais": ["Java", "Spring Boot"], "explicabilidade": [{"termo": "spring", "peso": 1.0}] }
```

Buscar conteúdos já classificados (Base de Conhecimento):

```
GET /conteudo?palavra-chave=spring
Response: [{ "id": 1, "titulo": "...", "texto": "...", "categoria": "Backend", "probabilidade": 0.89, "informacoes_adicionais": [...], "explicabilidade": [...], "criado_em": "2026-08-07T23:28:41Z" }]
```

## 6. Exemplos de uso (obrigatórios pelo edital)

| # | Título de entrada | Categoria esperada |
|---|---|---|
| 1 | Introdução ao Spring Boot | Backend |
| 2 | Como criar componentes reutilizáveis em React | Frontend |
| 3 | Treinando um modelo de classificação com Scikit-Learn | Dados |

## 7. Time e papéis

| Área | Papel |
|---|---|
| Product Owner | Prioriza backlog, valida entregas contra o edital, conduz sprint planning e demo |
| Backend (Java) | Tech Lead Backend — contratos de API, validação, tratamento de erros |
| Ciência de Dados | Tech Lead Dados — EDA, treino, avaliação e serialização do modelo |
| Frontend | Tech Lead Frontend — componentes, consumo da API |
| OCI/Cloud | Arquiteto OCI — Object Storage, Compute, deploy |
| QA | Especialista em Testes — valida os 3 exemplos obrigatórios, reporta bugs |
| DevOps | Engenheiro DevOps — pipeline de deploy |
| Documentação | Especialista em Hackathons — mantém README e roteiro de demo atualizados |

Detalhes de responsabilidades por área: seção 6 de [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md).

## 8. Contribuindo

Antes de abrir uma branch ou um Pull Request, leia [`CONTRIBUTING.md`](CONTRIBUTING.md) — define o fluxo Git simplificado do time (sem branch `develop`) e o padrão de commits.

## 9. Documentação completa

Toda a documentação oficial do projeto (arquitetura, backlog, cronograma, padrões de código, riscos, plano B e melhorias futuras) está em [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md).
