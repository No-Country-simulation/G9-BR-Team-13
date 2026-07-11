import numpy as np


def extract_keywords(text, pipeline, top_n=5):
    """
    Extrai as palavras-chave do texto que mais influenciaram a decisão do modelo.
    Usa os coeficientes do LinearSVC + pesos do TF-IDF.
    """
    tfidf = pipeline.named_steps['tfidf']
    clf = pipeline.named_steps['clf']

    X_vec = tfidf.transform([text])

    # Pega a classe com maior score
    decision_scores = clf.decision_function(X_vec)
    predicted_class_idx = np.argmax(decision_scores)

    coef = clf.coef_[predicted_class_idx]
    feature_names = tfidf.get_feature_names_out()

    word_contributions = {}

    # Itera sobre os termos que aparecem no texto
    for idx, value in zip(X_vec.indices, X_vec.data):
        if idx < len(coef):
            word = feature_names[idx]
            contribution = value * coef[idx]
            word_contributions[word] = abs(contribution)

    sorted_words = sorted(word_contributions.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_words[:top_n]]