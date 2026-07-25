"""
Script de upload de artefatos do modelo para OCI Object Storage.

Autentica via Resource Principal (ambiente cloud) com fallback para
configuracao local ~/.oci/config e envia os arquivos .joblib do modelo
e vetorizador para o bucket configurado.
"""

import os
import argparse
import logging
from pathlib import Path

# Configuração de logs do script
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Diretório raiz do projeto (ia/)
BASE_DIR = Path(__file__).resolve().parent.parent

# Mapeamento dos nomes dos objetos no bucket para os caminhos locais
ARTEFATOS = {
    "modelo.joblib": str(BASE_DIR / "models" / "modelo.joblib"),
    "vectorizer.joblib": str(BASE_DIR / "models" / "vectorizer.joblib"),
}


def upload_to_oci(bucket_name: str, namespace: str, region: str = "us-ashburn-1"):
    """
    Sincroniza os artefatos de ML do diretório local para o OCI Object Storage.

    Tenta autenticação via Resource Principal primeiro (ambiente de nuvem OCI),
    e faz fallback para a configuração local ~/.oci/config se necessário.

    Args:
        bucket_name (str): Nome do bucket no OCI Object Storage.
        namespace (str): Namespace do Object Storage no OCI.
        region (str, optional): Região OCI. Padrão é "us-ashburn-1".
    """
    # Importação lazy para evitar falha se o SDK OCI não estiver instalado
    import oci

    # Percorre cada artefato (modelo e vetorizador) e faz upload individual
    for object_name, local_path in ARTEFATOS.items():
        # Verifica se o arquivo local existe antes de tentar o upload
        if not os.path.exists(local_path):
            logger.error(f"Arquivo {local_path} nao encontrado. Execute train.py primeiro.")
            continue

        # Tenta autenticar via Resource Principal (OCI cloud) com fallback para config local
        try:
            signer = oci.auth.signers.get_resource_principals_signer()
            object_storage = oci.object_storage.ObjectStorageClient(config={}, signer=signer)
        except Exception:
            # Fallback para o arquivo de configuração OCI no diretório home
            config = oci.config.from_file("~/.oci/config")
            object_storage = oci.object_storage.ObjectStorageClient(config)

        # Leitura do arquivo local e envio ao bucket OCI
        with open(local_path, "rb") as f:
            object_storage.put_object(
                namespace_name=namespace,
                bucket_name=bucket_name,
                object_name=object_name,
                put_object_body=f,
            )

        logger.info(f"{object_name} enviado para oci://{namespace}/{bucket_name}/{object_name}")


# Bloco de execução principal com parsedor de argumentos CLI
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload de artefatos do modelo para OCI Object Storage")
    parser.add_argument("--bucket", default=os.getenv("OCI_BUCKET_NAME", "techknowledge-models"))
    parser.add_argument("--namespace", default=os.getenv("OCI_NAMESPACE"))
    parser.add_argument("--region", default=os.getenv("OCI_REGION", "us-ashburn-1"))

    args = parser.parse_args()

    # Validação da configuração obrigatória antes de prosseguir
    if not args.namespace:
        logger.error("OCI_NAMESPACE nao configurado. Defina a env var ou use --namespace.")
        exit(1)

    upload_to_oci(args.bucket, args.namespace, args.region)
