# backend/

API pública do projeto (Java 17 + Spring Boot 3.5). Valida a entrada, delega a classificação ao serviço de ML (`ia/`) via HTTP e persiste o histórico em PostgreSQL.

## Como rodar localmente

### Com Docker (recomendado)

Sobe backend + banco + serviço de ML juntos — ver [`../scripts/README.md`](../scripts/README.md) (`./scripts/dev.sh` a partir da raiz do repositório).

### Sem Docker

Pré-requisitos: Java 17+, um PostgreSQL acessível (local ou remoto), e o serviço de ML (`ia/`) rodando — sem ele, `POST /conteudo` falha com 503.

Defina as variáveis de ambiente antes de subir a aplicação (`src/main/resources/application.properties` não tem valores padrão para elas de propósito, para não vazar credenciais):

```bash
# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_NAME="techcontent"
$env:DB_USER="techuser"
$env:DB_PASSWORD="sua_senha"

# Linux/Mac
export DB_HOST=localhost DB_NAME=techcontent DB_USER=techuser DB_PASSWORD=sua_senha
```

Opcional — se o serviço de ML não estiver em `http://localhost:8000`:

```bash
export ML_SERVICE_URL=http://localhost:8000
```

Depois:

```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run         # Linux/Mac
```

A API sobe em `http://localhost:8080`. O `spring.jpa.hibernate.ddl-auto=update` cria/atualiza a tabela `conteudos` automaticamente ao subir — não há migrations manuais (Flyway/Liquibase) nesse projeto.

## Estrutura

```
backend/
└── src/main/java/com/time13/techcontentclassifier/
    ├── controller/    # ConteudoController — POST /conteudo (classificar) e GET /conteudo (buscar por palavra-chave)
    ├── service/       # ConteudoService (orquestra) + ClassificadorService (interface)
    │   └── impl/      # MlServiceClassificadorService — chama o serviço de ML real via RestClient
    ├── dto/           # ConteudoRequestDTO, ConteudoResponseDTO (contrato do POST),
    │                    ConteudoHistoricoDTO (contrato do GET, com id/titulo/texto/criado_em),
    │                    ExplicabilidadeDTO (termo + peso)
    ├── entity/        # Conteudo (JPA) + Tags
    ├── mapper/        # ConteudoMapper — converte entre DTOs e Entity, serializa/desserializa explicabilidade em JSON
    ├── repository/     # ConteudoRepository, TagsRepository
    ├── exception/      # GlobalExceptionHandler, RespostaErros (formato padronizado de erro)
    └── config/         # CorsConfig
```

## Endpoints

- `POST /conteudo` — recebe `{ "titulo", "texto" }`, devolve `{ "categoria", "probabilidade", "informacoes_adicionais", "explicabilidade" }`. Esse é o contrato fixo exigido pelo edital — não recebe novos campos que quebrem compatibilidade.
- `GET /conteudo?palavra-chave=termo` — busca por título, texto, categoria, informações adicionais ou tags (termo vazio devolve tudo). Devolve uma lista de `ConteudoHistoricoDTO`, que também inclui `id`, `titulo`, `texto` e `criado_em` (usado pela Base de Conhecimento do frontend).

## Regras importantes

- A persistência é **melhor-esforço**: se o banco falhar ao salvar, a resposta da classificação ainda é devolvida normalmente ao usuário (o erro só fica registrado no log). Isso vale tanto para o conteúdo quanto para a explicabilidade.
- Nomes de campo no JSON seguem convenção snake_case (`informacoes_adicionais`, `criado_em`), mesmo com o código Java em camelCase — via `@JsonProperty` nos DTOs. Segue o contrato oficial (edital + seção 14 do doc).
- A explicabilidade (pesos por termo) é calculada pelo serviço de ML e persistida como JSON numa coluna de texto (`Conteudo.explicabilidade`) — conteúdo classificado antes dessa funcionalidade existir simplesmente não tem esse campo preenchido (`ConteudoMapper` trata isso como lista vazia, sem quebrar).
- `criado_em` é exposto como `Instant` (sufixo `Z`, UTC explícito) — o relógio do container roda em UTC, e isso evita que o frontend interprete a hora errada ao converter pro fuso local de quem está vendo.

Mais contexto (contrato completo da API, modelagem do banco): veja [`../docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seções 14 e 15.
