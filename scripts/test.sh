#!/bin/bash
# ==============================================================================
# SCRIPT DE EXECUÇÃO DE SUÍTE DE TESTES EM CONTAINERS ISOLADOS
# ==============================================================================
set -e
cd "$(dirname "$0")/.."

echo "🧪 Executando testes nos contêineres..."

echo "📦 1/3 Executando testes do Backend (Java Maven)..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm backend ./mvnw test

echo "🐍 2/3 Executando testes da IA (Python Pytest)..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm ia-service pytest tests/ -v

echo "⚛️ 3/3 Executando testes do Frontend (React Vitest/Jest)..."
docker compose -f docker-compose.yml -f docker-compose.dev.yml run --rm frontend npm test

echo "✅ Todos os testes passaram com sucesso!"

