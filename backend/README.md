# backend/

API pública do projeto (Java 17 + Spring Boot). Valida a entrada, orquestra a classificação e persiste o histórico em PostgreSQL.

## Como rodar localmente

Pré-requisitos: Java 17+, um PostgreSQL acessível (local ou remoto).

Defina as variáveis de ambiente do banco antes de subir a aplicação (`src/main/resources/application.properties` não tem valores padrão para elas de propósito, para não vazar credenciais):

```bash
# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_NAME="time13"
$env:DB_USER="time13"
$env:DB_PASSWORD="time13"

# Linux/Mac
export DB_HOST=localhost DB_NAME=time13 DB_USER=time13 DB_PASSWORD=time13
```

Depois:

```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run         # Linux/Mac
```

A API sobe em `http://localhost:8080`. O `spring.jpa.hibernate.ddl-auto=update` cria a tabela `conteudos` automaticamente na primeira execução.

## Estrutura

```
backend/
└── src/main/java/com/time13/techcontentclassifier/
    ├── controller/    # ConteudoController — expõe POST /conteudo
    ├── service/       # ConteudoService (orquestra) + ClassificadorService (interface)
    │   └── impl/      # StaticClassificadorService — mock atual, será substituído
    │                    pela integração real com o serviço de ML (ia/) sem
    │                    precisar mudar Controller nem persistência
    ├── dto/           # ConteudoRequestDTO, ConteudoResponseDTO
    ├── entity/        # Conteudo (JPA)
    ├── mapper/        # ConteudoMapper — converte entre DTO e Entity
    ├── repository/    # ConteudoRepository
    └── exception/     # GlobalExceptionHandler
```

## Regras importantes

- A persistência é **melhor-esforço**: se o banco falhar, a resposta da classificação ainda é devolvida ao usuário (erro só fica no log). Ver seção 3.5 do doc.
- O campo `informacoes_adicionais` na resposta JSON é mapeado via `@JsonProperty` a partir do campo Java `informacoesAdicionais` — segue o contrato oficial (seção 14.2), mesmo usando convenção camelCase no código Java.
- Quando o serviço de ML (`ia/`) estiver pronto para ser chamado de verdade, crie uma nova implementação de `ClassificadorService` (ex.: `MlServiceClassificadorService`) e troque o bean ativo — não precisa mexer no resto da camada.

Mais contexto (contrato da API, modelagem do banco): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 14 e 15.
