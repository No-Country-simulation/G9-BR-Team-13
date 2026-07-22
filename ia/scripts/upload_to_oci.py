import os
import argparse
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent

ARTEFATOS = {
    "modelo.joblib": str(BASE_DIR / "models" / "modelo.joblib"),
    "vectorizer.joblib": str(BASE_DIR / "models" / "vectorizer.joblib"),
}


def upload_to_oci(bucket_name: str, namespace: str, region: str = "us-ashburn-1"):
    import oci

    for object_name, local_path in ARTEFATOS.items():
        if not os.path.exists(local_path):
            logger.error(f"Arquivo {local_path} nao encontrado. Execute train.py primeiro.")
            continue

        try:
            signer = oci.auth.signers.get_resource_principals_signer()
            object_storage = oci.object_storage.ObjectStorageClient(config={}, signer=signer)
        except Exception:
            config = oci.config.from_file("~/.oci/config")
            object_storage = oci.object_storage.ObjectStorageClient(config)

        with open(local_path, "rb") as f:
            object_storage.put_object(
                namespace_name=namespace,
                bucket_name=bucket_name,
                object_name=object_name,
                put_object_body=f,
            )

        logger.info(f"{object_name} enviado para oci://{namespace}/{bucket_name}/{object_name}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload de artefatos do modelo para OCI Object Storage")
    parser.add_argument("--bucket", default=os.getenv("OCI_BUCKET_NAME", "techknowledge-models"))
    parser.add_argument("--namespace", default=os.getenv("OCI_NAMESPACE"))
    parser.add_argument("--region", default=os.getenv("OCI_REGION", "us-ashburn-1"))

    args = parser.parse_args()

    if not args.namespace:
        logger.error("OCI_NAMESPACE nao configurado. Defina a env var ou use --namespace.")
        exit(1)

    upload_to_oci(args.bucket, args.namespace, args.region)
