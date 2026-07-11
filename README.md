# Time 13 — Organização Inteligente de Conteúdo Técnico

Hackathon ONE (Alura + Oracle) · Grupo G9 · Time 13

## 1. Sobre o projeto

Solução que recebe conteúdo técnico (título + texto) e devolve, via API REST, a categoria temática, a probabilidade da classificação e palavras-chave — usando TF-IDF + Regressão Logística treinados em cima de um dataset de exemplos técnicos. O Backend (Java/Spring Boot) expõe a API pública e delega a inferência a um serviço interno de Machine Learning (Python/FastAPI), persistindo o histórico em PostgreSQL/MySQL e publicando o modelo no OCI Object Storage.

A documentação completa do projeto (arquitetura detalhada, backlog, cronograma, padrões de código, especificação da API, riscos, etc.) está em [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md) — leiam esse arquivo antes de começar a codar na sua área.

## 2. Arquitetura

```
Frontend (React) ──HTTPS──► Backend API (Spring Boot) ──HTTP interno──► ML Service (FastAPI)
                                     │                                          │
                                     │ grava resultado (best-effort)            │ lê artefato na subida
                                     ▼                                          ▼
                            PostgreSQL / MySQL                        OCI Object Storage
                            (container Docker na                     (modelo.joblib,
                             mesma VM OCI Compute)                     vectorizer.joblib)
```

O Backend valida a entrada, chama o serviço de ML, formata a resposta no contrato do edital e grava o histórico no banco sem bloquear a resposta ao usuário. Detalhes completos do fluxo: seção 3 da [documentação](docs/DOCUMENTACAO_PROJETO.md).

## 3. Estrutura do monorepo

```
G9-BR-Team-13/
├── frontend/   # React + Vite — consome só o Backend, nunca o ML Service direto
├── backend/    # Java 17 + Spring Boot — API pública, validação, persistência
├── ia/         # Python + FastAPI + Scikit-Learn — notebook de treino e serviço de inferência
├── infra/      # scripts de deploy e integração OCI (Object Storage / Compute)
├── docs/       # documentação completa do projeto
├── README.md         # este arquivo
└── CONTRIBUTING.md    # fluxo de branches, commits e Pull Requests
```

Cada pasta (`frontend/`, `ia/`, `infra/`) tem seu próprio README com o passo a passo de como começar — comece por ali se você for o Tech Lead daquela área.

## 4. Como executar localmente

### Backend (Spring Boot)

Pré-requisitos: Java 17+, Maven (ou use o wrapper incluído).

```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run         # Linux/Mac
```

A API sobe em `http://localhost:8080`.

### Frontend e serviço de ML

Ainda não têm código neste repositório — siga as instruções em [`frontend/README.md`](frontend/README.md) e [`ia/README.md`](ia/README.md) para bootstrapar cada um.

## 5. Como usar a API

Ver especificação completa (endpoints, contrato de request/response, validações, códigos de erro) na seção 14 de [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md).

Contrato principal:

```
POST /conteudo
Request:  { "titulo": "...", "texto": "..." }
Response: { "categoria": "Backend", "probabilidade": 0.89, "informacoes_adicionais": ["Java", "Spring Boot"] }
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
