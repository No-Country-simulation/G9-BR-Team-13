import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.keywords import extract_keywords, extract_keywords_with_weights
import joblib


def test_extract_keywords_with_weights_empty_text():
    assert extract_keywords_with_weights("", None, None) == []
    assert extract_keywords_with_weights("   ", None, None) == []
    assert extract_keywords("", None, None) == []


def test_extract_keywords_with_weights_none_model():
    class DummyVectorizer:
        def transform(self, texts):
            import scipy.sparse as sp
            return sp.csr_matrix([[1, 0]])

        def get_feature_names_out(self):
            return ["java", "python"]

    vec = DummyVectorizer()
    assert extract_keywords_with_weights("java python", vec, None) == []


def test_extract_keywords_with_weights_mocked():
    import numpy as np
    import scipy.sparse as sp

    class MockVectorizer:
        def transform(self, texts):
            return sp.csr_matrix([[0.5, 1.0]])

        def get_feature_names_out(self):
            return np.array(["spring", "java"])

    class MockModel:
        coef_ = np.array([[2.0, 1.0]])

        def decision_function(self, X_vec):
            return np.array([1.5])

    vec = MockVectorizer()
    modelo = MockModel()

    res = extract_keywords_with_weights("spring java", vec, modelo, top_n=2)
    assert len(res) == 2
    assert all("termo" in d and "peso" in d for d in res)
    assert res[0]["peso"] == 1.0
    assert res[1]["peso"] == 1.0


def test_extract_keywords_with_weights_real_model_if_exists():
    vectorizer_path = BASE_DIR / "models" / "vectorizer.joblib"
    modelo_path = BASE_DIR / "models" / "modelo.joblib"

    if not vectorizer_path.exists() or not modelo_path.exists():
        return

    vectorizer = joblib.load(str(vectorizer_path))
    modelo = joblib.load(str(modelo_path))

    text = "Introducao ao Spring Boot para criacao de APIs REST em Java"
    res = extract_keywords_with_weights(text, vectorizer, modelo, top_n=3)

    assert isinstance(res, list)
    assert len(res) <= 3
    for item in res:
        assert "termo" in item
        assert "peso" in item
        assert isinstance(item["termo"], str)
        assert isinstance(item["peso"], float)
        assert 0.0 <= item["peso"] <= 1.0

    if res:
        assert res[0]["peso"] == 1.0
