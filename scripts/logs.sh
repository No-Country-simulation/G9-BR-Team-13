#!/bin/bash
# ==============================================================================
# SCRIPT DE VISUALIZAÇÃO DE LOGS DOS SERVIÇOS DOCKER
# ==============================================================================
# Uso:
#   ./scripts/logs.sh [postgres|backend|ia-service|frontend] -> Logs de um serviço
#   ./scripts/logs.sh                                         -> Logs de todos os serviços
# ==============================================================================

SERVICE=${1:-}

if [ -z "$SERVICE" ]; then
  echo "📜 Exibindo logs em tempo real de TODOS os serviços..."
  docker compose logs -f --tail=100
else
  echo "📜 Exibindo logs em tempo real do serviço: $SERVICE"
  docker compose logs -f --tail=100 "$SERVICE"
fi

