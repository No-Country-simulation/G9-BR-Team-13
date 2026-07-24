#!/bin/bash
# ==============================================================================
# SCRIPT DE COMPILAÇÃO E CONSTRUÇÃO DAS IMAGENS DOCKER DE PRODUÇÃO
# ==============================================================================
set -e
cd "$(dirname "$0")/.."

echo "🔨 Compilando todas as imagens de produção (sem cache)..."
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo "✅ Compilação concluída com sucesso! Para executar, use: ./scripts/prod.sh"

