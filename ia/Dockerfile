# ==============================================================================
# SERVIÇO DE IA & MACHINE LEARNING (Python FastAPI)
# ==============================================================================
FROM python:3.11-slim

WORKDIR /app

# Instala dependências nativas de sistema necessárias para compilar pacotes Python
RUN apt-get update && apt-get install -y --no-install-recommends gcc libffi-dev curl \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências Python sem salvar cache de instalação (reduz tamanho da imagem)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Cria usuário não-root para segurança
RUN useradd -m appuser && chown -R appuser:appuser /app

# Copia o código da aplicação
COPY . .
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Executa API FastAPI com servidor ASGI Uvicorn em modo multi-worker (4 workers)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]