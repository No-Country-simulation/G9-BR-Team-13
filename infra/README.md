# infra/

Tudo relacionado a subir os serviços na OCI e publicar o modelo no Object Storage, isolado do código de aplicação.

## Estrutura esperada

```
infra/
├── oci/                  # scripts de upload do modelo/vetorizador para o Object Storage
├── docker-compose.yml    # opcional: sobe backend + ia + banco juntos (ver "Melhorias Futuras" na doc)
└── deploy.sh              # script de deploy na instância OCI Compute
```

## O que entra aqui

- Scripts de provisionamento/publicação na OCI (Object Storage + Compute).
- Configuração do container do banco (PostgreSQL/MySQL) que roda na mesma instância Compute do backend e do serviço de ML.
- Docker Compose, se o time decidir containerizar tudo (não é obrigatório para o MVP).

Responsável por essa pasta: Arquiteto OCI. Mais contexto: veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seção 16.
