"""
Script interativo para teste de inferência no terminal.

Carrega o vetorizador e o modelo do disco e permite que o desenvolvedor
digite um texto e veja a categoria predita e as probabilidades calculadas.
"""

import joblib
import numpy as np

# Carrega os artefatos de IA persistidos no disco local
vectorizer = joblib.load("models/vectorizer.joblib")
modelo = joblib.load("models/modelo.joblib")

# Solicita a entrada de texto via CLI
texto = input("Digite o texto para classificar: ")

# Vetoriza o texto digitado e realiza a predição da classe
X_vec = vectorizer.transform([texto])
pred = modelo.predict(X_vec)[0]

# Extrai as probabilidades para cada classe possível
probs = modelo.predict_proba(X_vec)[0]
class_idx = list(modelo.classes_).index(pred)

# Exibe o resultado e a distribuição de probabilidades no terminal
print(f"Categoria prevista: {pred}")
print(f"Probabilidade: {probs[class_idx]:.4f}")
print("\nProbabilidades por categoria:")
for cat, prob in zip(modelo.classes_, probs):
    print(f"  {cat}: {prob:.4f}")