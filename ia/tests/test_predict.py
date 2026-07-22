import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.schemas import TextInput, PredictionOutput, CATEGORIAS
from app.keywords import extract_keywords

import joblib


def test_categorias_possui_4():
    assert len(CATEGORIAS) == 4
    assert "Backend" in CATEGORIAS
    assert "Frontend" in CATEGORIAS
    assert "Dados" in CATEGORIAS
    assert "DevOps" in CATEGORIAS


def test_text_input_validacao():
    valido = TextInput(titulo="Spring Boot", texto="Neste artigo vamos aprender sobre Spring Boot e suas configuracoes iniciais para criar APIs.")
    assert valido.titulo == "Spring Boot"
    assert len(valido.texto) >= 20


def test_text_input_titulo_curto():
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="AB", texto="Texto valido com mais de vinte caracteres para teste.")


def test_text_input_texto_curto():
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="Titulo", texto="curto")


def test_keywords_extraction_with_model():
    vectorizer_path = BASE_DIR / "models" / "vectorizer.joblib"
    modelo_path = BASE_DIR / "models" / "modelo.joblib"

    if not vectorizer_path.exists() or not modelo_path.exists():
        return

    vectorizer = joblib.load(str(vectorizer_path))
    modelo = joblib.load(str(modelo_path))

    text = "Introducao ao Spring Boot para criacao de APIs REST em Java"
    keywords = extract_keywords(text, vectorizer, modelo, top_n=5)

    assert isinstance(keywords, list)
    assert len(keywords) <= 5
    assert all(isinstance(k, str) for k in keywords)


def test_text_input_titulo_excede_maximo():
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="A" * 201, texto="Texto valido com mais de vinte caracteres para testar.")


def test_text_input_texto_excede_maximo():
    import pytest
    with pytest.raises(Exception):
        TextInput(titulo="Titulo", texto="A" * 5001)


def test_prediction_output_schema():
    saida = PredictionOutput(
        categoria="Backend",
        probabilidade=0.95,
        informacoes_adicionais=["Java", "Spring Boot", "API"]
    )
    assert saida.categoria == "Backend"
    assert saida.probabilidade == 0.95
    assert len(saida.informacoes_adicionais) == 3
