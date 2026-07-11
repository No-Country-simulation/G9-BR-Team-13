import joblib

model_path = "models/pipeline_classificador.pkl"
pipeline = joblib.load(model_path)

texto = input("Digite o texto para classificar: ")
pred = pipeline.predict([texto])[0]
print(f"Categoria prevista: {pred}")