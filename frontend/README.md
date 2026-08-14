# TechMind — Front-end

Interface do projeto **TechMind**, em React, para analisar, classificar e organizar conteúdo técnico consumindo a API do backend.

🔗 **No ar**: [tech-mind.duckdns.org](https://tech-mind.duckdns.org)

## Tecnologias

- React 19 + React Router
- Vite
- Tailwind CSS
- Lucide React (ícones)
- Fetch API

## Requisitos

Tenha instalado:

- Node.js 22 ou superior
- npm 10 ou superior

Confira com:

```bash
node -v
npm -v
```

## Como executar

Clone o repositório e entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` na raiz do front-end:

```env
VITE_API_URL=http://localhost:8080
```

Inicie o projeto:

```bash
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

## Telas

- **Analisar** (`/analisar`, tela inicial) — formulário pra classificar um novo conteúdo; mostra categoria, probabilidade e explicabilidade (peso por termo) do resultado.
- **Dashboard** (`/dashboard`) — visão geral com resumo das análises feitas no navegador atual.
- **Base de Conhecimento** (`/base-conhecimento`) — busca e lista os conteúdos já classificados e persistidos no banco (consome `GET /conteudo`), com filtro por categoria e um botão "Ver conteúdo" com o texto completo. Por padrão só mostra conteúdos com confiança de classificação ≥ 70% (os demais continuam salvos no banco, só não aparecem aqui).
- **Histórico** (`/historico`) — análises feitas nesse navegador, guardadas em `localStorage` (não é compartilhado entre dispositivos/navegadores).
- **Configurações** (`/configuracoes`) — tema claro/escuro, preferências e gerenciamento do histórico local.

## Observação

O front-end se comunica apenas com o backend Java, nunca diretamente com o serviço de Machine Learning:

```text
POST /conteudo   → classificar um novo conteúdo
GET  /conteudo   → buscar conteúdos já classificados (Base de Conhecimento)
```

## Status atual

Funcional e integrado ao backend real. Caso o backend não esteja acessível, é exibida uma mensagem de erro ao tentar analisar ou buscar conteúdo.
