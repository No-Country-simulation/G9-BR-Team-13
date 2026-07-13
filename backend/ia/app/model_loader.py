import os
import joblib
import logging
import oci
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

VECTORIZER_PATH = "models/vectorizer.joblib"
MODELO_PATH = "models/modelo.joblib"

OCI_BUCKET_NAME = os.getenv("OCI_BUCKET_NAME", "techknowledge-models")
OCI_NAMESPACE = os.getenv("OCI_NAMESPACE")

vectorizer = None
modelo = None


def download_from_oci(local_path, object_name):
    if os.path.exists(local_path):
        logger.info(f"{local_path} ja existe localmente. Pulando download.")
        return

    logger.info(f"Baixando {object_name} do OCI Object Storage...")

    try:
        if not OCI_NAMESPACE:
            raise ValueError("OCI_NAMESPACE nao configurado.")

        try:
            signer = oci.auth.signers.get_resource_principals_signer()
            object_storage = oci.object_storage.ObjectStorageClient(config={}, signer=signer)
        except Exception:
            config = oci.config.from_file("~/.oci/config")
            object_storage = oci.object_storage.ObjectStorageClient(config)

        os.makedirs(os.path.dirname(local_path), exist_ok=True)

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
