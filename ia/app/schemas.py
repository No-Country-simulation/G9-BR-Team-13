"""
Schemas Pydantic para validação e serialização de dados da API FastAPI.
"""

from pydantic import BaseModel, Field
from typing import List


CATEGORIAS = [
    "Backend", "Dados", "DevOps", "Frontend",
    "Mobile", "Ciberseguranca", "Cloud/Infra", "QA", "Blockchain",
    "UX/UI",
]


class TextInput(BaseModel):
    titulo: str = Field(min_length=3, max_length=200)
    texto: str = Field(min_length=20, max_length=5000)


class PredictionOutput(BaseModel):
    """
    Modelo de saída contendo os resultados da predição do modelo de IA.
    
    Attributes:
        categoria (str): Categoria predita pelo modelo (ex: 'Backend', 'Frontend').
        probabilidade (float): Grau de confiança da predição (entre 0.0 e 1.0).
        informacoes_adicionais (List[str]): Lista de palavras-chave mais relevantes extraídas do texto.
    """
    categoria: str
    probabilidade: float
    informacoes_adicionais: List[str]

