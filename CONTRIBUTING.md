# Como contribuir

Guia rápido para quem nunca trabalhou em grupo com Git/GitHub. Se travar em algum passo, chame o líder da sua área antes de forçar um comando destrutivo.

## Fluxo de branches

O time usa um fluxo simplificado, **sem branch `develop`**: tudo nasce de `main` e volta para `main` via Pull Request.

| Branch | Quando usar |
|---|---|
| `main` | Nunca commit direto aqui. Sempre via PR revisado por pelo menos 1 colega. |
| `feature/<area>-<descricao>` | Uma funcionalidade nova. Ex.: `feature/backend-endpoint-conteudo` |
| `bugfix/<descricao>` | Correção de um bug encontrado durante a sprint. Ex.: `bugfix/backend-validacao-texto-vazio` |
| `hotfix/<descricao>` | Correção urgente em algo que já está em `main`. Ex.: `hotfix/ml-service-timeout` |

Sempre prefixe a branch com a área (`backend`, `frontend`, `ml`/`ia`, `oci`, `infra`) para ficar fácil saber do que se trata só pelo nome.

## Passo a passo para abrir um Pull Request

```bash
# 1. Atualize sua main local
git checkout main
git pull origin main

# 2. Crie sua branch a partir da main
git checkout -b feature/backend-endpoint-conteudo

# 3. Trabalhe, commitando em pequenos passos (ver padrão de commits abaixo)
git add <arquivos>
git commit -m "feat(backend): adiciona endpoint POST /conteudo"

# 4. Suba a branch
git push -u origin feature/backend-endpoint-conteudo

# 5. Abra o Pull Request no GitHub apontando para main
# 6. Peça revisão de pelo menos 1 pessoa do time antes de mesclar
```

Antes de abrir o PR, rode o projeto localmente e confirme que nada quebrou (ver `README.md`, seção "Como executar localmente").

## Padrão de commits (Conventional Commits)

| Prefixo | Quando usar |
|---|---|
| `feat:` | nova funcionalidade |
| `fix:` | correção de bug |
| `refactor:` | mudança de código sem alterar comportamento externo |
| `docs:` | mudanças apenas em documentação |
| `test:` | adição ou ajuste de testes |
| `style:` | formatação, sem mudança de lógica |
| `chore:` | manutenção (dependências, configs, build) |

Formato: `prefixo(escopo): descrição curta no imperativo`

Exemplo: `feat(backend): adiciona validação de entrada no endpoint /conteudo`

## Checklist antes de abrir o PR

- [ ] O projeto builda/roda localmente sem erros
- [ ] Testei manualmente o que mudei
- [ ] A descrição do PR explica o que mudou e por quê
- [ ] Não deixei segredos (senhas, chaves de API) no código

## Regras da `main`

- Nunca dar push direto na `main`.
- Todo merge acontece via Pull Request, revisado por pelo menos 1 outra pessoa do time.
- Se a `main` quebrar (build falhando), a prioridade número 1 do time vira consertar isso — nenhuma feature nova avança até a `main` voltar a buildar.

Mais contexto sobre a estratégia Git e o motivo de não usarmos `develop`: seção 10 de [`docs/DOCUMENTACAO_PROJETO.md`](docs/DOCUMENTACAO_PROJETO.md).
