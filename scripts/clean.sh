#!/bin/bash
# ==============================================================================
# SCRIPT DE LIMPEZA E MANUTENÇÃO DO DOCKER (PREVINE ESTOURO DE DISCO)
# ==============================================================================
set -e
cd "$(dirname "$0")/.."

echo "🧹 Iniciando limpeza de manutenção do Docker..."

# Parar containers do projeto se estiverem rodando
docker compose down 2>/dev/null || true

# Remover containers parados, redes não utilizadas e imagens pendentes (dangling)
echo "🗑️  Removendo imagens pendentes e containers parados..."
docker system prune -f

# Limpar cache do BuildKit
echo "🧼 Limpando cache de compilação (BuildKit)..."
docker builder prune -f

if [ "$1" == "--all" ]; then
    echo "⚠️  Flag --all detectada: removendo todas as imagens e volumes não utilizados..."
    docker system prune -a --volumes -f
fi

echo "✅ Limpeza concluída! Espaço em disco recuperado."
