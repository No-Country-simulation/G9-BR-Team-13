import joblib
import numpy as np

vectorizer = joblib.load("models/vectorizer.joblib")
modelo = joblib.load("models/modelo.joblib")

texto = input("Digite o texto para classificar: ")

X_vec = vectorizer.transform([texto])
pred = modelo.predict(X_vec)[0]

probs = modelo.predict_proba(X_vec)[0]
class_idx = list(modelo.classes_).index(pred)

print(f"Categoria prevista: {pred}")
print(f"Probabilidade: {probs[class_idx]:.4f}")
print("\nProbabilidades por categoria:")
for cat, prob in zip(modelo.classes_, probs):
    print(f"  {cat}: {prob:.4f}")