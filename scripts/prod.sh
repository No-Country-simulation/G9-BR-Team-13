#!/bin/bash
# ==============================================================================
# SCRIPT DE INICIALIZAÇÃO DO AMBIENTE DE PRODUÇÃO (PROD)
# ==============================================================================
set -e
cd "$(dirname "$0")/.."

echo "🏭 Iniciando ambiente de PRODUÇÃO..."

# Carrega variáveis de ambiente de produção do arquivo .env.prod
export $(grep -v '^#' .env.prod 2>/dev/null | xargs) 2>/dev/null || true

# Constrói as imagens otimizadas e executa os contêineres em segundo plano (-d)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d --remove-orphans

echo "✅ Produção iniciada com sucesso. Para verificar o status, execute: ./scripts/status.sh"

