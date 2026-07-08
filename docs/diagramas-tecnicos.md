# Diagramas Técnicos — Time 13

> Documentação visual detalhada da arquitetura e fluxos internos do projeto.
> Para visualizar, use a extensão **Markdown Preview Mermaid Support** (`bierner.markdown-mermaid`) no VS Code e abra o preview com `Cmd+Shift+V`.
>
> ⚠️ Os diagramas C4 (`C4Container`, `C4Component`) exigem suporte adicional. Use [mermaid.live](https://mermaid.live) caso não renderizem no VS Code.

---

## 1. C4 Nível 2 — Diagrama de Contêiner

Detalha os processos e tecnologias dentro da plataforma e como se comunicam.

```mermaid
C4Container
    title Diagrama de Contêiner — Plataforma Time 13

    Person(usuario, "Usuário", "Acessa via navegador ou cliente HTTP.")

    System_Boundary(plataforma, "Plataforma Time 13") {
        Container(frontend, "Frontend", "React (Vite) / Streamlit", "Interface gráfica para submissão de textos e visualização de resultados.")
        Container(backend, "Backend API", "Java 17 / Spring Boot 3", "Orquestra o fluxo: valida entrada, chama o ML Service e persiste o resultado.")
        Container(ml_service, "ML Service", "Python 3.11 / FastAPI", "Executa a inferência: vetoriza o texto e retorna categoria, probabilidade e keywords.")
        ContainerDb(db, "Banco de Dados", "PostgreSQL", "Armazena o histórico de classificações para consulta e recomendação.")
    }

    System_Ext(oci_storage, "OCI Object Storage", "Armazena modelo.joblib e vectorizer.joblib.")

    Rel(usuario, frontend, "Usa", "HTTPS")
    Rel(frontend, backend, "POST /conteudo, GET /conteudos", "HTTP / JSON")
    Rel(backend, ml_service, "POST /predict", "HTTP interno")
    Rel(backend, db, "Persiste e consulta", "JDBC")
    Rel(ml_service, oci_storage, "Baixa artefatos no startup", "HTTPS / SDK OCI")
```

---

## 2. C4 Nível 3 — Diagrama de Componentes (Backend Java)

Detalha os componentes internos do contêiner Backend e suas responsabilidades.

```mermaid
C4Component
    title Diagrama de Componentes — Backend (Spring Boot)

    Container_Ext(frontend, "Frontend", "React / Streamlit", "Envia requisições HTTP ao backend.")
    Container_Ext(ml_service, "ML Service", "FastAPI", "Recebe POST /predict e retorna a predição.")
    ContainerDb_Ext(db, "Banco de Dados", "PostgreSQL", "Persistência do histórico.")

    Container_Boundary(backend, "Backend API (Spring Boot)") {
        Component(controller, "ConteudoController", "@RestController", "Expõe POST /conteudo, GET /conteudos e GET /conteudos/{id}/relacionados.")
        Component(validator, "Jakarta Bean Validation", "@Valid / @NotBlank", "Rejeita entradas inválidas na borda da aplicação antes de qualquer processamento.")
        Component(ml_client, "MlServiceClient", "@Component / RestTemplate", "Encapsula a chamada HTTP ao FastAPI e desserializa a resposta.")
        Component(repository, "ConteudoRepository", "Spring Data JPA", "Abstrai as operações de leitura e escrita no banco de dados.")
        Component(exception_handler, "GlobalExceptionHandler", "@ControllerAdvice", "Intercepta exceções e padroniza as respostas de erro (400, 503, 500).")
    }

    Rel(frontend, controller, "POST /conteudo", "HTTP / JSON")
    Rel(controller, validator, "Valida ConteudoRequest")
    Rel(controller, ml_client, "Delega inferência")
    Rel(controller, repository, "Persiste e consulta")
    Rel(ml_client, ml_service, "POST /predict", "HTTP interno")
    Rel(repository, db, "SQL", "JDBC")
    Rel(exception_handler, controller, "Intercepta exceções")
```

---

## 3. DER — Diagrama de Entidade-Relacionamento

Estrutura das tabelas principais no banco de dados relacional.

```mermaid
erDiagram
    CONTEUDO {
        BIGINT      id              PK
        VARCHAR     titulo
        TEXT        texto
        VARCHAR     categoria       FK
        FLOAT       probabilidade
        TIMESTAMP   criado_em
    }

    CATEGORIA {
        VARCHAR     nome            PK
        TEXT        descricao
    }

    KEYWORD {
        BIGINT      id              PK
        BIGINT      conteudo_id     FK
        VARCHAR     palavra
        FLOAT       peso_tfidf
    }

    CONTEUDO_RELACIONADO {
        BIGINT      conteudo_id         FK
        BIGINT      conteudo_rel_id     FK
        FLOAT       similaridade_cosseno
    }

    CATEGORIA    ||--o{ CONTEUDO             : "classifica"
    CONTEUDO     ||--o{ KEYWORD              : "possui"
    CONTEUDO     ||--o{ CONTEUDO_RELACIONADO : "referencia"
    CONTEUDO     }o--|| CONTEUDO_RELACIONADO : "referenciado por"
```

---

## 4. Sequência — Fluxo Completo de uma Requisição

Detalha o caminho do `POST /conteudo` desde o cliente até a resposta, incluindo os cenários de erro.

```mermaid
sequenceDiagram
    actor Cliente
    participant FE as Frontend
    participant BE as Backend (Spring Boot)
    participant ML as ML Service (FastAPI)
    participant DB as Banco de Dados

    Cliente->>FE: Submete título + texto
    FE->>BE: POST /conteudo (JSON)

    alt Validação falha (campo vazio ou texto < 20 chars)
        BE-->>FE: 400 Bad Request (VALIDATION_ERROR)
        FE-->>Cliente: Exibe mensagem de erro
    else Validação OK
        BE->>ML: POST /predict (título + texto)

        alt ML Service indisponível
            ML-->>BE: Timeout / Connection Error
            BE-->>FE: 503 Service Unavailable
            FE-->>Cliente: Exibe erro de serviço
        else Inferência OK
            ML-->>BE: categoria + probabilidade + keywords
            BE-->>FE: 200 OK (resposta completa)
            FE-->>Cliente: Exibe resultado
            BE-)DB: INSERT log (assíncrono / best-effort)
        end
    end
```

---

## 5. Sequência — Inicialização do ML Service

Mostra o processo de boot do FastAPI antes de aceitar qualquer requisição, garantindo que os artefatos de ML estejam carregados em memória.

```mermaid
sequenceDiagram
    participant Docker as Docker (container ia)
    participant App as FastAPI (main.py)
    participant Loader as model_loader.py
    participant OCI as OCI Object Storage

    Docker->>App: Inicia container (uvicorn main:app)
    App->>Loader: Chama load_models() no startup event

    Loader->>OCI: GET modelo.joblib
    OCI-->>Loader: Arquivo binário

    Loader->>OCI: GET vectorizer.joblib
    OCI-->>Loader: Arquivo binário

    Loader->>Loader: joblib.load() → objetos em memória
    Loader-->>App: modelo + vectorizer prontos

    App-->>Docker: Aplicação pronta (porta 8000)
    Note over App: A partir daqui aceita POST /predict
```

---

## 6. Pipeline de ML (Treinamento e Inferência)

Fluxo completo desde o texto bruto até a predição em produção.

```mermaid
flowchart LR
    subgraph TREINO["🧪 Treino (Notebook)"]
        direction TB
        T1["📄 Dataset\n400+ textos rotulados"]
        T2["🧹 Limpeza\n(lowercase, stopwords,\npunctuation)"]
        T3["📊 TF-IDF Vectorizer\nfit_transform()"]
        T4["🤖 Regressão Logística\nfit()"]
        T5["📈 Avaliação\nAcurácia / F1-Macro"]
        T6["💾 Serialização\nmodelo.joblib\nvectorizer.joblib"]

        T1 --> T2 --> T3 --> T4 --> T5 --> T6
    end

    subgraph OCI_STORAGE["☁️ OCI Object Storage"]
        direction TB
        A1["modelo.joblib"]
        A2["vectorizer.joblib"]
    end

    subgraph INFERENCIA["⚡ Inferência (FastAPI)"]
        direction TB
        I1["📥 POST /predict\n{titulo, texto}"]
        I2["🔄 vectorizer.transform()"]
        I3["🎯 modelo.predict_proba()"]
        I4["🔑 Extração de Keywords\n(maiores pesos TF-IDF)"]
        I5["📤 Resposta\ncategoria + prob + keywords"]

        I1 --> I2 --> I3 --> I4 --> I5
    end

    T6 -->|upload| OCI_STORAGE
    OCI_STORAGE -->|download no startup| INFERENCIA
```

---

## 7. Diagrama de Classes — Backend Java

Estrutura das principais classes do módulo `com.time13.conteudo`.

```mermaid
classDiagram
    class ConteudoController {
        +classificar(ConteudoRequest) ConteudoResponse
        +listar(String categoria) List~ConteudoResponse~
        +buscarRelacionados(Long id) List~ConteudoResponse~
    }

    class ConteudoRequest {
        +String titulo
        +String texto
    }

    class ConteudoResponse {
        +String categoria
        +Double probabilidade
        +List~String~ informacoesAdicionais
    }

    class MlServiceClient {
        -String mlServiceUrl
        +predict(ConteudoRequest) MlPredictResponse
    }

    class MlPredictResponse {
        +String categoria
        +Double probabilidade
        +List~String~ keywords
    }

    class ConteudoEntity {
        +Long id
        +String titulo
        +String texto
        +String categoria
        +Double probabilidade
        +LocalDateTime criadoEm
    }

    class ConteudoRepository {
        +findByCategoria(String) List~ConteudoEntity~
    }

    class GlobalExceptionHandler {
        +handleValidation(MethodArgumentNotValidException) ErrorResponse
        +handleGeneric(Exception) ErrorResponse
    }

    class ErrorResponse {
        +String erro
        +String mensagem
    }

    ConteudoController --> ConteudoRequest : recebe
    ConteudoController --> ConteudoResponse : retorna
    ConteudoController --> MlServiceClient : usa
    ConteudoController --> ConteudoRepository : usa
    MlServiceClient --> MlPredictResponse : retorna
    ConteudoRepository --> ConteudoEntity : persiste
    GlobalExceptionHandler --> ErrorResponse : retorna
```

---

## 8. Diagrama de Implantação — OCI Compute

Visão da infraestrutura em produção: containers Docker rodando na VM OCI e suas comunicações.

```mermaid
flowchart TD
    subgraph INTERNET["🌐 Internet"]
        USER["👤 Usuário / Banca"]
    end

    subgraph OCI_COMPUTE["☁️ OCI Compute — VM Ampere A1 (2 OCPUs / 12 GB RAM)"]
        subgraph DOCKER["🐳 Docker Compose"]
            FE_C["frontend\n(React / Streamlit)\n:3000"]
            BE_C["backend\n(Spring Boot)\n:8080"]
            ML_C["ia\n(FastAPI)\n:8000"]
            DB_C["db\n(PostgreSQL)\n:5432"]
        end
    end

    subgraph OCI_STORAGE["☁️ OCI Object Storage"]
        BUCKET["Bucket: modelos\n├── modelo.joblib\n└── vectorizer.joblib"]
    end

    USER -->|HTTPS :443| FE_C
    FE_C -->|HTTP :8080| BE_C
    BE_C -->|HTTP :8000\nPOST /predict| ML_C
    BE_C -->|JDBC :5432| DB_C
    ML_C -->|HTTPS (SDK OCI)\ndownload na inicialização| BUCKET
```

---

*Gerado em: 2025 · Time 13 — Hackathon ONE (Alura + Oracle)*
