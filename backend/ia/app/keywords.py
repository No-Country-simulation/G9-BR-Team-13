import numpy as np


def extract_keywords(text, vectorizer, modelo, top_n=5):
    X_vec = vectorizer.transform([text])

    decision_scores = modelo.decision_function(X_vec)
    predicted_class_idx = np.argmax(decision_scores)

    coef = modelo.coef_[predicted_class_idx]
    feature_names = vectorizer.get_feature_names_out()

    word_contributions = {}

    for idx, value in zip(X_vec.indices, X_vec.data):
        if idx < len(coef):
            word = feature_names[idx]
            contribution = value * coef[idx]
            word_contributions[word] = abs(contribution)

    sorted_words = sorted(word_contributions.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_words[:top_n]]
