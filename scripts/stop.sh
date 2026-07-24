#!/bin/bash
# ==============================================================================
# SCRIPT DE PARADA E LIMPEZA DE TODOS OS AMBIENTES DOCKER
# ==============================================================================
cd "$(dirname "$0")/.."
echo "🛑 Parando todos os contêineres e limpando recursos..."

# Encerra os contêineres e remove volumes de desenvolvimento e produção
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v 2>/dev/null || true
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v 2>/dev/null || true
docker compose down -v 2>/dev/null || true

echo "✅ Todos os ambientes foram parados com sucesso!"

