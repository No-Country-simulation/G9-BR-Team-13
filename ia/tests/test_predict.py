"""
Suite de testes para o serviço de classificação de conteúdos técnicos.

Cobre validação de schemas Pydantic, extração de palavras-chave e
verificação das categorias suportadas pelo modelo de ML.
"""

import sys
from pathlib import Path

# Configura o path raiz do projeto para importação dos módulos
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.schemas import TextInput, PredictionOutput
from app.keywords import extract_keywords

import joblib


def test_categorias_possui_10():
    """Verifica se a lista de categorias suportadas contém exatamente as 10 tech esperadas."""
    from app.schemas import CATEGORIAS
    assert len(CATEGORIAS) == 10
    assert "Backend" in CATEGORIAS
    assert "Frontend" in CATEGORIAS
    assert "Dados" in CATEGORIAS
    assert "DevOps" in CATEGORIAS
    assert "Mobile" in CATEGORIAS
    assert "Ciberseguranca" in CATEGORIAS
    assert "Cloud/Infra" in CATEGORIAS
    assert "QA" in CATEGORIAS
    assert "Blockchain" in CATEGORIAS
    assert "UX/UI" in CATEGORIAS


def test_text_input_valido():
    """Valida que um TextInput com dados corretos é aceito pelo schema Pydantic."""
    valido = TextInput(titulo="Spring Boot", texto="Neste artigo vamos aprender sobre Spring Boot e suas configuracoes iniciais para criar APIs REST.")
    assert valido.titulo == "Spring Boot"
    assert len(valido.texto) >= 20


def test_text_input_titulo_curto():
    """Verifica que um título abaixo do min_length (3) é rejeitado pelo schema."""
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="AB", texto="Texto valido com mais de vinte caracteres para teste.")


def test_text_input_texto_curto():
    """Verifica que um texto abaixo do min_length (20) é rejeitado pelo schema."""
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="Titulo", texto="curto")


def test_text_input_titulo_excede_maximo():
    """Verifica que um título acima do max_length (200) é rejeitado pelo schema."""
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="A" * 201, texto="Texto valido com mais de vinte caracteres para testar.")


def test_text_input_texto_excede_maximo():
    """Verifica que um texto acima do max_length (5000) é rejeitado pelo schema."""
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="Titulo", texto="A" * 5001)


def test_prediction_output_schema():
    """Valida que um PredictionOutput é corretamente construído e seus campos acessíveis."""
    saida = PredictionOutput(
        categoria="Backend",
        probabilidade=0.95,
        informacoes_adicionais=["Java", "Spring Boot", "API"]
    )
    assert saida.categoria == "Backend"
    assert saida.probabilidade == 0.95
    assert len(saida.informacoes_adicionais) == 3


def test_keywords_extraction_with_model():
    """Testa a extração de palavras-chave usando os artefatos de ML salvos em disco."""
    vectorizer_path = BASE_DIR / "models" / "vectorizer.joblib"
    modelo_path = BASE_DIR / "models" / "modelo.joblib"

    # Skipping silencioso se os artefatos não existirem (ex: CI sem modelo treinado)
    if not vectorizer_path.exists() or not modelo_path.exists():
        return

    # Carrega os artefatos do disco e executa a extração
    vectorizer = joblib.load(str(vectorizer_path))
    modelo = joblib.load(str(modelo_path))

    text = "Introducao ao Spring Boot para criacao de APIs REST em Java"
    keywords = extract_keywords(text, vectorizer, modelo, top_n=5)

    # Verifica o formato da resposta (lista de strings com no máximo 5 itens)
    assert isinstance(keywords, list)
    assert len(keywords) <= 5
    assert all(isinstance(k, str) for k in keywords)
