# infra/

Esta pasta existe pra manter a estrutura de 5 áreas do monorepo documentada no projeto (`frontend/`, `backend/`, `ia/`, `infra/`, `docs/`), mas **não guarda arquivos de infraestrutura diretamente** — eles ficam na raiz do repositório. Esta página só aponta pra onde cada coisa realmente está.

## Por que não está aqui dentro

O Docker Compose precisa enxergar `backend/`, `frontend/` e `ia/` ao mesmo tempo pra buildar cada serviço (`context: ./backend`, `context: ./frontend`, etc.) — por isso os arquivos `docker-compose*.yml` ficam na raiz do repositório, não dentro de uma subpasta. Os scripts de deploy seguem a mesma lógica.

## Onde encontrar cada coisa

| O que você procura | Onde está |
|---|---|
| Orquestração dos containers (banco, backend, IA, frontend) | [`../docker-compose.yml`](../docker-compose.yml) + overrides [`docker-compose.dev.yml`](../docker-compose.dev.yml) / [`docker-compose.prod.yml`](../docker-compose.prod.yml) |
| Scripts pra subir/parar/testar/limpar o ambiente | [`../scripts/`](../scripts/) — ver [`scripts/README.md`](../scripts/README.md) |
| Configuração do Nginx (proxy + HTTPS do frontend em produção) | [`../frontend/nginx.conf`](../frontend/nginx.conf) |
| Upload do modelo treinado pro OCI Object Storage | [`../ia/scripts/upload_to_oci.py`](../ia/scripts/upload_to_oci.py) |
| Download do modelo a partir do OCI Object Storage (usado pelo serviço de ML ao subir) | [`../ia/app/model_loader.py`](../ia/app/model_loader.py) |
| Variáveis de ambiente necessárias | [`../.env.example`](../.env.example) |

## Resumo da infraestrutura

- **Banco de dados**: PostgreSQL 16, container próprio, dados persistidos em volume nomeado.
- **Deploy**: Docker Compose na instância OCI Compute, HTTPS via Let's Encrypt (domínio `tech-mind.duckdns.org`).
- **Modelo de ML**: artefatos (`.joblib`) publicados no OCI Object Storage; o serviço de IA baixa na inicialização se as variáveis `OCI_*` estiverem configuradas, senão usa os arquivos locais em `ia/models/`.

Mais contexto (arquitetura completa, integração OCI): veja [`../docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seção 16.
