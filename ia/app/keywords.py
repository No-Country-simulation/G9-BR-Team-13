"""
Módulo de extração de palavras-chave baseada na contribuição dos termos do modelo.
"""

from typing import Dict, List, Optional, Tuple, Any

import numpy as np


def extract_keywords(
    text: str,
    vectorizer,
    modelo,
    top_n: int = 3,
) -> List[str]:
    """
    Extrai as palavras-chave mais influentes de um texto com base nos coeficientes
    do modelo de Regressão Logística.

    A contribuição de cada termo é calculada multiplicando o valor TF-IDF do termo
    no texto pelo coeficiente do modelo correspondente à classe predita. Os termos
    são ordenados pela contribuição (em valor absoluto) e os top `top_n` são retornados.

    Args:
        text (str): Texto completo (título + conteúdo) a ser analisado.
        vectorizer (TfidfVectorizer): Vetorizador TF-IDF treinado.
        modelo (LogisticRegression): Modelo de classificação treinado.
        top_n (int, optional): Quantidade de palavras-chave a retornar. Padrão é 3.

    Returns:
        List[str]: Lista com os termos de maior contribuição para a classe predita.
                   Retorna lista vazia se o texto for vazio, se não houver palavras
                   no vocabulário ou se o modelo não possuir coeficientes válidos.
    """
    explicabilidade = extract_keywords_with_weights(text, vectorizer, modelo, top_n=top_n)
    return [item["termo"] for item in explicabilidade]


def extract_keywords_with_weights(
    text: str,
    vectorizer,
    modelo,
    top_n: int = 3,
) -> List[Dict[str, Any]]:
    """
    Extrai os termos de maior contribuição acompanhados de seus respectivos pesos (explicabilidade).

    Args:
        text (str): Texto completo a ser analisado.
        vectorizer (TfidfVectorizer): Vetorizador TF-IDF treinado.
        modelo (LogisticRegression): Modelo de classificação treinado.
        top_n (int, optional): Quantidade de termos a retornar. Padrão é 3.

    Returns:
        List[Dict[str, Any]]: Lista de dicionários no formato [{"termo": str, "peso": float}].
    """
    if not text or not text.strip():
        return []

    X_vec = vectorizer.transform([text])
    if X_vec.shape[1] == 0 or X_vec.nnz == 0:
        return []

    feature_names = vectorizer.get_feature_names_out()
    if len(feature_names) == 0:
        return []

    coef = _get_class_coefficients(modelo, X_vec)
    if coef is None:
        return []

    word_contributions = {}

    # Multiplica a frequência TF-IDF do termo no texto pelo peso (coeficiente) do modelo
    for idx, value in zip(X_vec.indices, X_vec.data):
        if idx < len(coef):
            word = feature_names[idx]
            contribution = value * coef[idx]
            word_contributions[word] = abs(contribution)

    if not word_contributions:
        return []

    # Ordena os termos em ordem decrescente de contribuição
    sorted_words = sorted(word_contributions.items(), key=lambda x: x[1], reverse=True)
    top_words = sorted_words[:top_n]

    # Normaliza pesos (se houver variação) ou arredonda o valor de contribuição
    max_weight = top_words[0][1] if top_words and top_words[0][1] > 0 else 1.0

    result = []
    for word, weight in top_words:
        # Peso relativo normalizado entre 0.0 e 1.0 para facilidade de exibição percentual
        normalized_weight = round(float(weight / max_weight), 4) if max_weight > 0 else round(float(weight), 4)
        result.append({"termo": word, "peso": normalized_weight})

    return result



def _get_class_coefficients(modelo, X_vec) -> Optional[np.ndarray]:
    """
    Retorna os coeficientes do modelo referentes à classe predita para o vetor X_vec.

    Suporta classificação binária (coef_ com 1 linha) e multiclasse (coef_ com N linhas).

    Args:
        modelo (LogisticRegression): Modelo de classificação treinado.
        X_vec (scipy.sparse): Matriz TF-IDF do texto a ser analisado.

    Returns:
        Optional[np.ndarray]: Vetor de coeficientes da classe predita ou None
                              se o modelo não possuir coeficientes válidos.
    """
    if not hasattr(modelo, "coef_") or modelo.coef_ is None:
        return None

    n_classes, n_features = modelo.coef_.shape
    if n_classes == 0 or n_features == 0:
        return None

    # Identifica a classe predita
    if hasattr(modelo, "decision_function"):
        decision_scores = np.asarray(modelo.decision_function(X_vec)).ravel()
        predicted_class_idx = int(np.argmax(decision_scores))
    elif hasattr(modelo, "predict_proba"):
        probs = modelo.predict_proba(X_vec)[0]
        predicted_class_idx = int(np.argmax(probs))
    else:
        return None

    # Classificação binária: coef_ possui 1 linha (referente à classe positiva).
    # Para a classe negativa, os coeficientes equivalentes são os negativos.
    if n_classes == 1:
        coef = modelo.coef_[0]
        if predicted_class_idx == 0:
            coef = -coef
        return coef

    return modelo.coef_[predicted_class_idx]
