import os
import joblib
import logging
import oci
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from app.utils import extract_keywords

# Carrega variáveis de ambiente (se existir .env)
load_dotenv()

# Configuração de logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="TechKnowledge ML Service")


# Modelos de dados (Pydantic)
class TextInput(BaseModel):
    titulo: str
    texto: str


class PredictionOutput(BaseModel):
    categoria: str
    probabilidade: float
    palavrasChave: List[str]


# Variável global para armazenar o pipeline
pipeline = None

# Configurações do OCI (via variáveis de ambiente)
OCI_BUCKET_NAME = os.getenv("OCI_BUCKET_NAME", "techknowledge-models")
OCI_NAMESPACE = os.getenv("OCI_NAMESPACE")  # Obrigatório para OCI
MODEL_OBJECT_NAME = os.getenv("MODEL_OBJECT_NAME", "pipeline_classificador.pkl")
LOCAL_MODEL_PATH = "models/pipeline_classificador.pkl"


def download_model_from_oci():
    """Baixa o modelo do OCI Object Storage se não existir localmente"""
    if os.path.exists(LOCAL_MODEL_PATH):
        logger.info("Modelo já existe localmente. Pulando download.")
        return

    logger.info("Tentando baixar modelo do OCI Object Storage...")

    try:
        # Se OCI_NAMESPACE não estiver configurado, assume que está rodando localmente sem OCI
        if not OCI_NAMESPACE:
            raise ValueError("OCI_NAMESPACE não configurado. Configure a variável de ambiente.")

        # Tenta autenticação via Instance Principal (recomendado para OCI Compute)
        try:
            signer = oci.auth.signers.get_resource_principals_signer()
            object_storage = oci.object_storage.ObjectStorageClient(config={}, signer=signer)
            logger.info("Autenticado via Instance Principal da OCI.")
        except Exception:
            # Fallback para API Key (uso local)
            config = oci.config.from_file("~/.oci/config")
            object_storage = oci.object_storage.ObjectStorageClient(config)
            logger.info("Autenticado via API Key (arquivo ~/.oci/config).")

        # Garante que a pasta existe
        os.makedirs(os.path.dirname(LOCAL_MODEL_PATH), exist_ok=True)

        # Download
        get_obj = object_storage.get_object(
            namespace_name=OCI_NAMESPACE,
            bucket_name=OCI_BUCKET_NAME,
            object_name=MODEL_OBJECT_NAME
        )

        with open(LOCAL_MODEL_PATH, 'wb') as f:
            for chunk in get_obj.data.raw.stream(1024 * 1024):
                f.write(chunk)

        logger.info("✅ Modelo baixado do OCI com sucesso!")

    except Exception as e:
        logger.warning(f"⚠️ Não foi possível baixar do OCI: {e}")
        # Se não existir localmente, levanta exceção para parar a aplicação
        if not os.path.exists(LOCAL_MODEL_PATH):
            raise RuntimeError("Modelo não encontrado nem localmente nem no OCI.") from e


@app.on_event("startup")
def load_model():
    global pipeline
    download_model_from_oci()

    try:
        pipeline = joblib.load(LOCAL_MODEL_PATH)
        logger.info(f"✅ Pipeline carregado de {LOCAL_MODEL_PATH}")
    except Exception as e:
        logger.error(f"❌ Erro ao carregar modelo: {e}")
        raise e


@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: TextInput):
    if not pipeline:
        raise HTTPException(status_code=503, detail="Modelo não carregado")

    full_text = f"{input_data.titulo} {input_data.texto}"

    try:
        # Predição
        pred_class = pipeline.predict([full_text])[0]

        # Probabilidade (aproximada via softmax manual para LinearSVC)
        decision = pipeline.decision_function([full_text])[0]
        exp_scores = np.exp(decision - np.max(decision))
        probs = exp_scores / exp_scores.sum()
        class_idx = list(pipeline.classes_).index(pred_class)
        probability = float(probs[class_idx])

        # Palavras-chave
        keywords = extract_keywords(full_text, pipeline, top_n=5)

        return PredictionOutput(
            categoria=pred_class,
            probabilidade=round(probability, 4),
            palavrasChave=keywords
        )
    except Exception as e:
        logger.error(f"Erro na predição: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar o texto")