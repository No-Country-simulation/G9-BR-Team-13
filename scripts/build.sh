#!/bin/bash
# ==============================================================================
# SCRIPT DE COMPILAÇÃO E CONSTRUÇÃO DAS IMAGENS DOCKER DE PRODUÇÃO
# ==============================================================================
set -e
cd "$(dirname "$0")/.."

EXTRA_ARGS="$@"

echo "🔨 Compilando todas as imagens de produção..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build $EXTRA_ARGS

echo "✅ Compilação concluída com sucesso! Para executar, use: ./scripts/prod.sh"


