"""
Schemas Pydantic para validação e serialização de dados da API FastAPI.
"""

from pydantic import BaseModel
from typing import List


class TextInput(BaseModel):
    """
    Modelo de entrada de dados para requisição de classificação.
    
    Attributes:
        titulo (str): Título do conteúdo técnico a ser classificado.
        texto (str): Corpo/conteúdo do texto técnico.
    """
    titulo: str
    texto: str


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

