# InfoHub AI — Front-end

Interface do projeto **InfoHub AI**, desenvolvida em React para organização e classificação de conteúdo técnico.

## Tecnologias

- React
- Vite
- Tailwind CSS
- Lucide React
- JavaScript
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

## Observação

O front-end se comunica apenas com o backend Java pelo endpoint:

```text
POST /conteudo
```

O serviço de Machine Learning não deve ser chamado diretamente pelo React.

## Status atual

A interface está funcional e preparada para integração com o backend.

Caso o backend não esteja em execução, será exibida uma mensagem de erro ao tentar analisar um conteúdo.