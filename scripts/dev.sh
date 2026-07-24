#!/bin/bash
# ==============================================================================
# SCRIPT DE INICIALIZAÇÃO DO AMBIENTE DE DESENVOLVIMENTO (DEV)
# ==============================================================================
# Interrompe o script se qualquer comando falhar
set -e

echo "🚀 Iniciando ambiente de DESENVOLVIMENTO..."

# Carrega variáveis de ambiente do arquivo .env.dev (se existir)
export $(grep -v '^#' .env.dev 2>/dev/null | xargs) 2>/dev/null || true

# Aplica a sobreposição do Compose para dev com hot-reload e reconstrução de imagens alteradas
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build --remove-orphans

