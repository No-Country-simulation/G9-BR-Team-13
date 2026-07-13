# 🚀 Time 13 - Organização Inteligente de Conteúdo Técnico

<div align="center">

## 🤖 Hackathon ONE

### Alura + Oracle | Grupo G9 | Time 13

**Transformando conteúdos técnicos em conhecimento organizado através de Inteligência Artificial.**

</div>

---

# 🌟 Sobre o Projeto

## 🧠 Uma solução inteligente para classificar conteúdos técnicos

Nosso projeto nasceu com um objetivo simples:

> **Organizar conhecimento técnico automaticamente usando Inteligência Artificial. 🚀**

A plataforma recebe um conteúdo técnico contendo:

📝 **Título**
📄 **Texto do conteúdo**

E através de um modelo de Machine Learning realiza:

✅ Classificação automática por categoria
📊 Cálculo da probabilidade da previsão
🔎 Extração de palavras-chave relevantes
💾 Armazenamento do histórico das análises

---

## ⚙️ Como nossa inteligência funciona?

Utilizamos técnicas de Ciência de Dados para transformar texto em informação:

🔹 **TF-IDF**

> Responsável por identificar a importância das palavras dentro dos conteúdos analisados.

🔹 **Regressão Logística**

> Modelo utilizado para realizar a classificação das categorias técnicas.

🔹 **Dataset de exemplos técnicos**

> Base utilizada para treinar o modelo e melhorar a precisão das respostas.

---

# 🏗️ Arquitetura da Solução

Nossa aplicação utiliza uma arquitetura moderna, separando responsabilidades para garantir escalabilidade e organização.

```
              🌐 Usuário
                  |
                  |
                  ▼
        🖥️ Frontend React
                  |
              HTTPS
                  |
                  ▼
        ⚙️ Backend Spring Boot
                  |
            HTTP interno
                  |
                  ▼
        🤖 Serviço IA FastAPI
                  |
        ┌─────────┴─────────┐
        ▼                   ▼
 🗄️ PostgreSQL/MySQL    ☁️ OCI Storage
 Histórico             Modelo IA
                        (.joblib)
```

---

# 🔄 Fluxo da Aplicação

### 1️⃣ Usuário envia conteúdo

Exemplo:

```
Título:
"Introdução ao Spring Boot"

Texto:
"Framework Java utilizado para criação
de aplicações backend."
```

⬇️

### 2️⃣ Backend recebe e valida

O Spring Boot:

✔ Verifica os dados enviados
✔ Controla a comunicação com a IA
✔ Trata possíveis erros

⬇️

### 3️⃣ Inteligência Artificial analisa

O serviço Python:

🤖 Processa o texto
📚 Consulta o modelo treinado
🎯 Retorna a classificação

⬇️

### 4️⃣ Resultado entregue ao usuário

Resposta:

```json
{
 "categoria": "Backend",
 "probabilidade": 0.89,
 "informacoes_adicionais": [
   "Java",
   "Spring Boot"
 ]
}
```

---

# 📂 Organização do Projeto

```
📦 G9-BR-Team-13

├── 🎨 frontend
│   └── React + Vite
│       Interface do usuário

├── ⚙️ backend
│   └── Java 17 + Spring Boot
│       API principal

├── 🤖 ia
│   └── Python + FastAPI
│       Modelo Machine Learning

├── ☁️ infra
│   └── Scripts OCI
│       Deploy e infraestrutura

├── 📚 docs
│   └── Documentação completa

├── 📄 README.md

└── 🤝 CONTRIBUTING.md
```

---

# 🛠️ Tecnologias Utilizadas

## 🎨 Frontend

🔹 React
🔹 Vite
🔹 Consumo da API REST

---

## ⚙️ Backend

🔹 Java 17
🔹 Spring Boot
🔹 API REST
🔹 Validação de dados
🔹 Persistência no banco

---

## 🤖 Inteligência Artificial

🔹 Python
🔹 FastAPI
🔹 Scikit-Learn
🔹 TF-IDF
🔹 Regressão Logística

---

## ☁️ Cloud

🔹 Oracle Cloud Infrastructure (OCI)

Utilizando:

☁️ Object Storage
🖥️ Compute Instance
🐳 Containers Docker

---

# 🚀 Executando o Projeto

## ⚙️ Backend

Pré-requisitos:

✔ Java 17+
✔ Maven instalado

Execute:

```bash
cd backend

./mvnw.cmd spring-boot:run
```

Servidor disponível:

```
http://localhost:8080
```

---

# 🔌 API REST

## 📌 Endpoint principal

### ➡️ POST /conteudo

Envia um conteúdo para classificação.

### 📥 Entrada:

```json
{
 "titulo":"Como criar componentes React",
 "texto":"Aprenda sobre componentes reutilizáveis"
}
```

### 📤 Retorno:

```json
{
 "categoria":"Frontend",
 "probabilidade":0.92,
 "informacoes_adicionais":[
    "React",
    "Componentes"
 ]
}
```

---

# 🧪 Exemplos de Validação

| Nº   | Entrada                              | Resultado esperado |
| ---- | ------------------------------------ | ------------------ |
| 🚀 1 | Introdução ao Spring Boot            | Backend            |
| ⚛️ 2 | Componentes reutilizáveis em React   | Frontend           |
| 📊 3 | Modelo de classificação Scikit-Learn | Dados              |

---

# 👥 Nosso Time

Cada integrante possui uma missão importante:

| Área                | Responsabilidade                         |
| ------------------- | ---------------------------------------- |
| 🎯 Product Owner    | Organiza prioridades, backlog e entregas |
| ⚙️ Backend          | Desenvolve APIs e regras de negócio      |
| 🧠 Ciência de Dados | Treina e avalia modelos de IA            |
| 🎨 Frontend         | Cria interfaces e experiência do usuário |
| ☁️ OCI Cloud        | Infraestrutura e deploy                  |
| 🧪 QA               | Testes e qualidade da solução            |
| 🚀 DevOps           | Automação e pipelines                    |
| 📚 Documentação     | Organização dos materiais do projeto     |

---

# 🤝 Como Contribuir

Antes de começar:

📖 Leia a documentação oficial:

```
docs/DOCUMENTACAO_PROJETO.md
```

Depois:

1️⃣ Crie sua branch
2️⃣ Desenvolva sua funcionalidade
3️⃣ Faça commits organizados
4️⃣ Abra um Pull Request

---

# 📚 Documentação Oficial

Toda a evolução do projeto está documentada:

📌 Arquitetura
📌 Backlog
📌 Cronograma
📌 Padrões de código
📌 Riscos
📌 Melhorias futuras

---

<div align="center">

# 🚀 Time 13

## 💡 Inteligência Artificial transformando informação em conhecimento.

### 🤖 Classifique. Organize. Evolua.

</div>

---

## 🔘 Navegação rápida

[🚀 Projeto](#-sobre-o-projeto)
[🏗️ Arquitetura](#-arquitetura-da-solução)
[📂 Estrutura](#-organização-do-projeto)
[⚙️ Tecnologias](#-tecnologias-utilizadas)
[🔌 API](#-api-rest)
[👥 Time](#-nosso-time)

---

Ficou com uma aparência mais próxima de **README profissional de projeto de Hackathon/portfólio GitHub**, com storytelling e destaque para a solução. 🚀

