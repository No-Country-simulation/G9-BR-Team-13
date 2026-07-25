# Scripts de Automação e Orquestração Docker

Este diretório contém os scripts utilitários em shell para gerenciar o ciclo de vida completo da aplicação (desenvolvimento, testes, build e produção).

---

## 💻 Suporte Multiplataforma (Linux, macOS e Windows)

Os scripts foram desenvolvidos utilizando Bash padrão POSIX.

### 🐧 Linux / 🍎 macOS
No terminal Linux ou macOS, torne os scripts executáveis (se necessário) e execute diretamente:
```bash
chmod +x scripts/*.sh
./scripts/dev.sh
```

### 🪟 Windows
No Windows, você pode rodar os scripts através de:
1. **Git Bash** (Recomendado): Abra o Git Bash na raiz do projeto e execute `./scripts/dev.sh`.
2. **WSL (Windows Subsystem for Linux)**: Execute normalmente `./scripts/dev.sh` dentro da distribuição Linux.
3. **PowerShell ou Prompt de Comando (CMD)**:
   Caso possua o Bash no seu PATH ou Git para Windows instalado:
   ```powershell
   sh ./scripts/dev.sh
   ```

---

## ⚡ Inicio Rápido (Comandos Úteis)

```bash
# Iniciar em Modo de Desenvolvimento (Hot reload + Debug na porta 5005)
./scripts/dev.sh

# Iniciar em Modo de Produção (Otimizado, executando em segundo plano)
./scripts/prod.sh

# Verificar o status de todos os contêineres e health checks
./scripts/status.sh

# Visualizar logs em tempo real (Todos os serviços ou um específico)
./scripts/logs.sh              # Todos os serviços
./scripts/logs.sh backend      # Apenas a API Java
./scripts/logs.sh ia-service   # Apenas o serviço de IA
./scripts/logs.sh frontend     # Apenas a aplicação React
./scripts/logs.sh postgres     # Apenas o Banco de Dados

# Executar a suíte completa de testes em containers isolados
./scripts/test.sh

# Compilar todas as imagens Docker de produção sem cache
./scripts/build.sh

# Parar todos os contêineres e remover volumes temporários
./scripts/stop.sh
```

---

## 🔐 Configuração de Variáveis de Ambiente (.env)

Por razões de segurança e boas práticas de DevSecOps, **nenhum arquivo de ambiente contendo senhas reais (`.env.dev` ou `.env.prod`) é commitado no repositório**. 

Antes de executar a aplicação pela primeira vez, cada desenvolvedor deve criar seu arquivo de ambiente local a partir do modelo [.env.example](file:///.env.example):

### 1. Para Ambiente de Desenvolvimento Local:
```bash
# Copie o modelo .env.example para .env.dev
cp .env.example .env.dev
```

### 2. Para Ambiente de Produção / Staging:
```bash
# Copie o modelo .env.example para .env.prod
cp .env.example .env.prod
```
> ⚠️ **Importante:** Altere as credenciais padrão (como `DB_PASSWORD`) nos arquivos `.env.dev` e `.env.prod` locais antes de subir a aplicação em produção.

| Arquivo | Descrição | Status no Git |
|---------|-----------|---------------|
| `.env.example` | Modelo público de variáveis sem segredos reais | **Rastreado (Commitado)** |
| `.env.dev` | Configurações do ambiente de dev local (carregado por `dev.sh`) | **Ignorado (.gitignore)** |
| `.env.prod` | Configurações e segredos do ambiente de produção (carregado por `prod.sh`) | **Ignorado (.gitignore)** |


---

## 🌐 Portas dos Serviços

| Serviço | Porta Dev | Porta Prod | Descrição |
|---------|-----------|------------|-----------|
| **Frontend** | 5173 | 5173 | Aplicação React / Vite servida via Nginx |
| **Backend** | 8080 | 8080 | API Spring Boot (Java 21) |
| **IA Service** | 8000 | 8000 | API Python FastAPI / Uvicorn |
| **PostgreSQL** | 5432 | 5432 | Banco de dados relacional |
| **Debug Java** | 5005 | N/A | Porta JDWP para Remote Debugging (IDE) |

---

## 🐞 Depuração Remota (Backend Java)

Para depurar o Backend Java durante a execução em ambiente Dev (`./scripts/dev.sh`), conecte o Depurador Remoto (Remote JVM Debug) da sua IDE (IntelliJ IDEA, VS Code ou Eclipse) no host `localhost` e porta `5005`.

