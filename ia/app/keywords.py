"""
Módulo de extração de palavras-chave baseada na contribuição dos termos do modelo.
"""

import numpy as np


def extract_keywords(text, vectorizer, modelo, top_n=5):
    """
    Extrai as palavras-chave mais influentes de um texto com base nos coeficientes do modelo de Regressão Logística.

    Args:
        text (str): Texto completo (título + conteúdo) a ser analisado.
        vectorizer (TfidfVectorizer): Vetorizador TF-IDF treinado.
        modelo (LogisticRegression): Modelo de classificação treinado.
        top_n (int, optional): Quantidade de palavras-chave a retornar. Padrão é 5.

    Returns:
        List[str]: Lista com os termos de maior relevância/contribuição para a classe predita.
    """
    X_vec = vectorizer.transform([text])
    feature_names = vectorizer.get_feature_names_out()

    if hasattr(modelo, "decision_function"):
        decision_scores = modelo.decision_function(X_vec)
        predicted_class_idx = np.argmax(decision_scores)
    elif hasattr(modelo, "predict_proba"):
        probs = modelo.predict_proba(X_vec)[0]
        predicted_class_idx = np.argmax(probs)
    else:
        return []

    coef = modelo.coef_[predicted_class_idx]

    word_contributions = {}

    # Multiplica a frequência TF-IDF do termo no texto pelo peso (coeficiente) do modelo
    for idx, value in zip(X_vec.indices, X_vec.data):
        if idx < len(coef):
            word = feature_names[idx]
            contribution = value * coef[idx]
            word_contributions[word] = abs(contribution)

    # Ordena os termos em ordem decrescente de contribuição e retorna as top N palavras
    sorted_words = sorted(word_contributions.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_words[:top_n]]

