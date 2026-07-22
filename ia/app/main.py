"""
Ponto de entrada do serviço de Machine Learning / IA (FastAPI).

Fornece o endpoint POST /predict para classificação de conteúdos técnicos,
carregando os artefatos de IA durante a inicialização (lifespan).
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from app.schemas import TextInput, PredictionOutput
from app import model_loader
from app.keywords import extract_keywords

# Configuração de Logs da aplicação
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerenciador de contexto do ciclo de vida da aplicação FastAPI.
    Carrega os modelos e vetorizadores TF-IDF antes de receber requisições HTTP.
    """
    model_loader.load_artefatos()
    yield


# Inicialização da instância FastAPI com título e manipulador do ciclo de vida
app = FastAPI(title="TechKnowledge ML Service", lifespan=lifespan)


@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: TextInput):
    """
    Endpoint de classificação de texto técnico.

    Recebe o título e o texto do conteúdo, executa a vetorização TF-IDF,
    realiza a predição da categoria, calcula a probabilidade/confiança e extrai palavras-chave.

    Args:
        input_data (TextInput): Objeto JSON de entrada contendo 'titulo' e 'texto'.

    Returns:
        PredictionOutput: Objeto JSON de resposta contendo 'categoria', 'probabilidade' e 'informacoes_adicionais'.

    Raises:
        HTTPException(503): Caso o modelo ou vetorizador não tenham sido carregados na memória.
        HTTPException(500): Caso ocorra algum erro inesperado durante o processamento.
    """
    # Valida se os artefatos de ML estão prontos para uso
    if not model_loader.modelo or not model_loader.vectorizer:
        raise HTTPException(status_code=503, detail="Modelo nao carregado")

    # Concatena título e texto em uma única string para a análise do modelo
    full_text = f"{input_data.titulo} {input_data.texto}"

    try:
        # Vetoriza o texto usando TF-IDF e faz a predição da categoria
        X_vec = model_loader.vectorizer.transform([full_text])
        pred_class = model_loader.modelo.predict(X_vec)[0]

        # Calcula a probabilidade associada à classe prevista
        probs = model_loader.modelo.predict_proba(X_vec)[0]
        class_idx = list(model_loader.modelo.classes_).index(pred_class)
        probability = float(probs[class_idx])

        # Extrai as 5 palavras-chave mais influentes para o resultado
        keywords = extract_keywords(full_text, model_loader.vectorizer, model_loader.modelo, top_n=5)

        return PredictionOutput(
            categoria=pred_class,
            probabilidade=round(probability, 4),
            informacoes_adicionais=keywords
        )
    except Exception as e:
        logger.error(f"Erro na predicao: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar o texto")