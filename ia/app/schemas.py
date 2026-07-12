from pydantic import BaseModel
from typing import List


class TextInput(BaseModel):
    titulo: str
    texto: str


class PredictionOutput(BaseModel):
    categoria: str
    probabilidade: float
    informacoes_adicionais: List[str]
