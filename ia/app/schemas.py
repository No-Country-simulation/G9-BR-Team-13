"""
Schemas Pydantic para validação e serialização de dados da API FastAPI.
"""

from typing import List

from pydantic import BaseModel, Field


CATEGORIAS = [
    "Backend", "Dados", "DevOps", "Frontend",
    "Mobile", "Ciberseguranca", "Cloud/Infra", "QA", "Blockchain",
    "UX/UI",
]


class TextInput(BaseModel):
    titulo: str = Field(min_length=3, max_length=200)
    texto: str = Field(min_length=20, max_length=5000)


class ExplicabilidadeItem(BaseModel):
    """
    Item de explicabilidade da predição do modelo de IA.

    Attributes:
        termo (str): Nome da palavra-chave/termo analisado.
        peso (float): Coeficiente/peso de relevância do termo.
    """
    termo: str
    peso: float


class PredictionOutput(BaseModel):
    """
    Modelo de saída contendo os resultados da predição do modelo de IA.

    Attributes:
        categoria (str): Categoria predita pelo modelo (ex: 'Backend', 'Frontend').
        probabilidade (float): Grau de confiança da predição (entre 0.0 e 1.0).
        informacoes_adicionais (List[str]): Lista de palavras-chave mais relevantes extraídas do texto.
        explicabilidade (List[ExplicabilidadeItem]): Lista de termos e seus pesos de relevância na predição.
    """
    categoria: str
    probabilidade: float
    informacoes_adicionais: List[str]
    explicabilidade: List[ExplicabilidadeItem] = Field(default_factory=list)

