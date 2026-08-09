import boto3
from app.core.config import settings

# Initialize the AWS Bedrock Runtime Client
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name=settings.AWS_DEFAULT_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
)
