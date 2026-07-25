"""
Script de treinamento e otimização do modelo de Machine Learning.

Carrega o dataset em CSV, divide em dados de treino/teste com estratificação,
executa validação cruzada (GridSearchCV) otimizando o TF-IDF e a Regressão Logística,
e salva os artefatos (.joblib) e métricas (.json) no diretório 'models/'.
"""

import pandas as pd
import joblib
import yaml
import os
import json
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

# Carregar parâmetros e hiperparâmetros do arquivo de configuração YAML
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

# 1. Carregar dataset e preparar variáveis X (features textuais) e y (rótulo/categoria)
df = pd.read_csv("data/dataset.csv")
X = df["texto"].astype(str).fillna("")
y = df["categoria"]

# Verificar distribuição das classes no dataset
class_counts = y.value_counts()
print("Distribuição das classes:")
print(class_counts)

# 2. Divisão Treino/Teste (Estratificada para manter a proporção das classes)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Determinar número de folds dinamicamente com base na classe de menor frequência
min_samples = min(y_train.value_counts())
cv_folds = min(5, min_samples)
print(f"\nUsando {cv_folds} folds na validação cruzada (mínimo de amostras por classe: {min_samples})")

# 4. Construção do Pipeline (TfidfVectorizer + LogisticRegression)
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        stop_words=config['tfidf']['stop_words'],
        ngram_range=tuple(config['tfidf']['ngram_range']),
        max_df=config['tfidf']['max_df'],
        min_df=config['tfidf']['min_df']
    )),
    ('clf', LogisticRegression(
        C=config['model']['C'],
        class_weight='balanced',
        random_state=42,
        max_iter=1000,
        solver='lbfgs'
    ))
])

# Grade de hiperparâmetros para busca via GridSearchCV
param_grid = {
    'tfidf__max_df': [0.7, 0.9],
    'tfidf__ngram_range': [(1,1), (1,2)],
    'clf__C': [0.1, 1.0, 10.0]
}

# Execução do GridSearchCV para busca do melhor modelo
grid = GridSearchCV(pipeline, param_grid, cv=cv_folds, scoring='f1_weighted', n_jobs=-1)
grid.fit(X_train, y_train)

# 5. Avaliação do modelo treinado na massa de testes isolada
y_pred = grid.predict(X_test)
report = classification_report(y_test, y_pred, output_dict=True)
print("\nMelhores parâmetros:", grid.best_params_)
print("Acurácia:", grid.score(X_test, y_test))

# 6. Salvar vetorizador TF-IDF e modelo treinado separadamente em arquivos .joblib
os.makedirs("models", exist_ok=True)
best_pipeline = grid.best_estimator_
joblib.dump(best_pipeline.named_steps['tfidf'], "models/vectorizer.joblib")
joblib.dump(best_pipeline.named_steps['clf'], "models/modelo.joblib")

# 7. Salvar relatório de métricas em formato JSON para auditoria
with open("models/metrics.json", "w") as f:
    json.dump(report, f, indent=4)

print("\n[OK] Vetorizador salvo em 'models/vectorizer.joblib'")
print("[OK] Modelo salvo em 'models/modelo.joblib'")
print("[OK] Metricas salvas em 'models/metrics.json'")