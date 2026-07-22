import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import TextInput, PredictionOutput, HealthOutput, CATEGORIAS
from app import model_loader
from app.keywords import extract_keywords

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_loader.load_artefatos()
    yield


app = FastAPI(title="TechKnowledge ML Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthOutput)
async def health():
    return HealthOutput(
        status="ok",
        modelo_carregado=model_loader.modelo is not None and model_loader.vectorizer is not None,
        categorias=list(model_loader.modelo.classes_) if model_loader.modelo is not None else CATEGORIAS
    )


@app.get("/categorias")
async def listar_categorias():
    if model_loader.modelo is not None:
        return {"categorias": list(model_loader.modelo.classes_)}
    return {"categorias": CATEGORIAS}


@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: TextInput):
    if not model_loader.modelo or not model_loader.vectorizer:
        raise HTTPException(status_code=503, detail="Modelo nao carregado")

    full_text = f"{input_data.titulo} {input_data.texto}"

    try:
        X_vec = model_loader.vectorizer.transform([full_text])
        pred_class = model_loader.modelo.predict(X_vec)[0]

        probs = model_loader.modelo.predict_proba(X_vec)[0]
        class_idx = list(model_loader.modelo.classes_).index(pred_class)
        probability = float(probs[class_idx])

        keywords = extract_keywords(full_text, model_loader.vectorizer, model_loader.modelo, top_n=5)

        return PredictionOutput(
            categoria=pred_class,
            probabilidade=round(probability, 4),
            informacoes_adicionais=keywords
        )
    except Exception as e:
        logger.error(f"Erro na predicao: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar o texto")