from typing import Any

import boto3
from botocore.exceptions import ClientError

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_s3_client() -> Any:
    """Build and return a boto3 S3 client configured for MinIO."""
    endpoint = settings.minio_endpoint
    if not endpoint.startswith(("http://", "https://")):
        endpoint = f"http://{endpoint}"

    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=settings.minio_access_key,
        aws_secret_access_key=settings.minio_secret_key,
        region_name="us-east-1",
    )


def upload_bytes(key: str, data: bytes, content_type: str = "application/octet-stream") -> None:
    """Upload byte content to the configured MinIO bucket."""
    client = get_s3_client()
    client.put_object(
        Bucket=settings.minio_bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )


def get_presigned_url(key: str, expires_in: int = 3600) -> str:
    """Generate a presigned GET URL for an object in MinIO."""
    client = get_s3_client()
    url: str = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.minio_bucket, "Key": key},
        ExpiresIn=expires_in,
    )
    return url


def ensure_bucket_exists() -> None:
    """Ensure the target MinIO bucket exists, creating it if necessary."""
    client = get_s3_client()
    bucket_name = settings.minio_bucket
    try:
        client.head_bucket(Bucket=bucket_name)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        if error_code in ("404", "NoSuchBucket", "403"):
            try:
                client.create_bucket(Bucket=bucket_name)
                logger.info("Created MinIO bucket: %s", bucket_name)
            except ClientError as create_err:
                create_code = create_err.response.get("Error", {}).get("Code")
                if create_code not in ("BucketAlreadyOwnedByYou", "BucketAlreadyExists"):
                    raise create_err
        else:
            raise e
