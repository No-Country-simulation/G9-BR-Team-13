# frontend/

Aplicação React que consome a API do backend (`/conteudo`) e mostra o resultado da classificação para o usuário.

**Regra importante:** o frontend fala **apenas** com o Backend Java (`backend/`). Nunca chama o serviço de ML (`ia/`) diretamente.

## Stack

- React + Vite
- `fetch` nativo para chamadas HTTP (sem necessidade de biblioteca extra)

## Como começar

Dentro desta pasta:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev
```

## Estrutura esperada

```
frontend/
├── src/
│   ├── components/   # componentes reutilizáveis (Form, ResultCard, Loader)
│   ├── pages/         # telas (Home)
│   ├── services/       # chamadas à API (api.js) — nunca faça fetch direto dentro de um componente
│   └── App.jsx
└── package.json
```

## Padrões de código

- Componentes funcionais com Hooks, nunca class components.
- Estado de loading e erro sempre explícito (`isLoading`, `error`) — nunca inferido pela ausência de dados.
- Chamadas de API isoladas em `src/services/api.js`.

Mais contexto (contrato da API, exemplos de request/response): veja [`docs/DOCUMENTACAO_PROJETO.md`](../docs/DOCUMENTACAO_PROJETO.md), seção 14.
