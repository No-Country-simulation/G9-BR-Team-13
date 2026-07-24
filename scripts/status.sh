#!/bin/bash
# ==============================================================================
# SCRIPT DE DIAGNÓSTICO E STATUS DOS CONTÊINERES
# ==============================================================================
cd "$(dirname "$0")/.."
echo "=== Status dos Contêineres Docker Compose ==="
docker compose ps

echo -e "\n=== Verificação de Saúde dos Serviços (Health Check) ==="
# Lista de serviços da aplicação
for svc in postgres ia-service backend frontend; do
  if docker compose ps $svc 2>/dev/null | grep -q "Up"; then
    echo "✅ $svc: Em execução (Running)"
  else
    echo "❌ $svc: Parado (Stopped)"
  fi
done

