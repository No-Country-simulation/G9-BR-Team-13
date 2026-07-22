from pydantic import BaseModel, Field
from typing import List


CATEGORIAS = ["Backend", "Dados", "DevOps", "Frontend"]


class TextInput(BaseModel):
    titulo: str = Field(..., min_length=3, max_length=200)
    texto: str = Field(..., min_length=20, max_length=5000)


class PredictionOutput(BaseModel):
    categoria: str
    probabilidade: float
    informacoes_adicionais: List[str]


class HealthOutput(BaseModel):
    status: str
    modelo_carregado: bool
    categorias: List[str]
