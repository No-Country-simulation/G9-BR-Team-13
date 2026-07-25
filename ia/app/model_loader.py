"""
Módulo de carregamento e sincronização dos artefatos de Machine Learning.

Suporta o download automático de modelos (.joblib) a partir do OCI Object Storage
usando autenticação por Resource Principal ou arquivo de configuração ~/.oci/config.
"""

import os
import joblib
import logging
import oci
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

logger = logging.getLogger(__name__)

# Caminhos locais para os arquivos salvos do modelo e vetorizador
VECTORIZER_PATH = "models/vectorizer.joblib"
MODELO_PATH = "models/modelo.joblib"

# Configurações do OCI Object Storage
OCI_BUCKET_NAME = os.getenv("OCI_BUCKET_NAME", "techknowledge-models")
OCI_NAMESPACE = os.getenv("OCI_NAMESPACE")

# Variáveis globais contendo as instâncias carregadas na memória
vectorizer = None
modelo = None


def download_from_oci(local_path, object_name):
    """
    Baixa um objeto salvo no OCI Object Storage caso ele não exista no disco local.

    Tenta autenticação via Resource Principal primeiro (ambiente de nuvem OCI),
    e faz fallback para a configuração local ~/.oci/config se necessário.

    Args:
        local_path (str): Caminho no sistema de arquivos local onde o arquivo deve ser salvo.
        object_name (str): Nome do objeto/arquivo armazenado no bucket do OCI.
    """
    if os.path.exists(local_path):
        logger.info(f"{local_path} ja existe localmente. Pulando download.")
        return

    logger.info(f"Baixando {object_name} do OCI Object Storage...")

    try:
        if not OCI_NAMESPACE:
            raise ValueError("OCI_NAMESPACE nao configurado.")

        # Tenta autenticação nativa de ambiente OCI (Resource Principal Signer)
        try:
            signer = oci.auth.signers.get_resource_principals_signer()
            object_storage = oci.object_storage.ObjectStorageClient(config={}, signer=signer)
        except Exception:
            # Fallback para a configuração local via arquivo ~/.oci/config
            config = oci.config.from_file("~/.oci/config")
            object_storage = oci.object_storage.ObjectStorageClient(config)

        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # Realiza o download do arquivo em chunks
        get_obj = object_storage.get_object(
            namespace_name=OCI_NAMESPACE,
            bucket_name=OCI_BUCKET_NAME,
            object_name=object_name
        )

        with open(local_path, 'wb') as f:
            for chunk in get_obj.data.raw.stream(1024 * 1024):
                f.write(chunk)

        logger.info(f"{object_name} baixado do OCI com sucesso!")
    except Exception as e:
        logger.warning(f"Nao foi possivel baixar {object_name} do OCI: {e}")
        if not os.path.exists(local_path):
            raise RuntimeError(f"{local_path} nao encontrado nem localmente nem no OCI.") from e


def load_artefatos():
    """
    Carrega o vetorizador e o modelo de ML na memória da aplicação a partir dos arquivos .joblib.
    Se necessário, tenta baixar os artefatos do OCI Object Storage antes de carregar.
    """
    global vectorizer, modelo
    download_from_oci(VECTORIZER_PATH, "vectorizer.joblib")
    download_from_oci(MODELO_PATH, "modelo.joblib")

    try:
        vectorizer = joblib.load(VECTORIZER_PATH)
        modelo = joblib.load(MODELO_PATH)
        logger.info(f"Vetorizador carregado de {VECTORIZER_PATH}")
        logger.info(f"Modelo carregado de {MODELO_PATH}")
    except Exception as e:
        logger.error(f"Erro ao carregar artefatos: {e}")
        raise e

