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
    # Transforma o texto de entrada na representação vetorial TF-IDF
    X_vec = vectorizer.transform([text])

    # Calcula as pontuações de decisão e identifica o índice da classe predita
    decision_scores = modelo.decision_function(X_vec)
    predicted_class_idx = np.argmax(decision_scores)

    # Obtém os coeficientes do modelo para a classe predita e os nomes dos termos
    coef = modelo.coef_[predicted_class_idx]
    feature_names = vectorizer.get_feature_names_out()

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

