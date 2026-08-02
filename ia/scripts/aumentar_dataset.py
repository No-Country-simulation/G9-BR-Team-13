"""
Aumenta o dataset existente com exemplos curtos e limpos (formato real da API).

O modelo treinado apenas com artigos longos da Wikipedia classifica mal textos
curtos como "Introducao ao Spring Boot". Este script mescla exemplos sinteticos
curtos no dataset atual sem refazer a ingestao completa da Wikipedia.

Uso:
    python scripts/aumentar_dataset.py [n_por_categoria]

Experimento que valida esta abordagem (holdout interno de dados reais):
    so Wikipedia: 61.8% | + sinteticos curtos: 69.7%
"""

import csv
import os
import random
import sys

sys.path.insert(0, os.path.dirname(__file__))
from ingest_wikipedia import gerar_exemplos_sinteticos

N_POR_CATEGORIA = int(sys.argv[1]) if len(sys.argv) > 1 else 300


def carregar_dataset(caminho):
    with open(caminho, "r", encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def salvar_dataset(caminho, linhas):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["titulo", "texto", "categoria"])
        writer.writeheader()
        writer.writerows(linhas)


def main():
    caminho = "data/dataset.csv"
    linhas = carregar_dataset(caminho)

    # Identifica os exemplos reais (Wikipedia): textos longos (>= 400 chars).
    # Os exemplos sinteticos curtos sao descartados para serem regenerados
    # do zero, evitando duplicatas acumuladas entre execucoes.
    linhas_reais = [l for l in linhas if len(l["texto"]) >= 400]
    print(f"Exemplos reais (Wikipedia) preservados: {len(linhas_reais)}")

    sinteticos = gerar_exemplos_sinteticos(N_POR_CATEGORIA)
    print(f"Exemplos curtos sinteticos a adicionar: {len(sinteticos)}")

    linhas = linhas_reais + sinteticos
    random.shuffle(linhas)
    salvar_dataset(caminho, linhas)

    from collections import Counter
    contagem = Counter(item["categoria"] for item in linhas)
    print(f"\nDataset aumentado: {len(linhas)} exemplos")
    for cat, qtd in sorted(contagem.items()):
        print(f"  {cat}: {qtd}")
    print(f"[OK] Salvo em '{caminho}'")


if __name__ == "__main__":
    main()
