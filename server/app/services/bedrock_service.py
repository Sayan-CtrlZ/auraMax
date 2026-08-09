import json
from fastapi import HTTPException, status
from app.clients.aws import bedrock_client

import base64

def analyze_image(image_base64: str, prompt: str) -> dict:
    """
    Sends the base64 image along with the prompt to Amazon Nova 2 Lite on Bedrock.
    """
    if "," in image_base64:
        image_base64 = image_base64.split(",")[1]

    # Decode the base64 string into raw binary bytes for boto3
    image_bytes = base64.b64decode(image_base64)

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "image": {
                        "format": "jpeg",
                        "source": {
                            "bytes": image_bytes
                        }
                    }
                },
                {
                    "text": prompt
                }
            ]
        }
    ]

    try:
        response = bedrock_client.converse(
            modelId="amazon.nova-2-lite-v1:0",
            messages=messages,
            inferenceConfig={
                "maxTokens": 2048,
                "temperature": 0.0
            }
        )
        
        response_text = response['output']['message']['content'][0]['text']
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AWS Bedrock Converse API call failed: {str(e)}"
        )

    try:
        return json.loads(response_text)
    except json.JSONDecodeError as e:
        if "```json" in response_text:
            cleaned_text = response_text.split("```json")[1].split("```")[0].strip()
            return json.loads(cleaned_text)
        
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Failed to parse JSON response",
                "error": str(e),
                "raw_response": response_text
            }
        )

def generate_text(prompt: str) -> dict:
    """
    Sends a text prompt to Meta Llama 3 70B on Bedrock.
    """
    messages = [
        {
            "role": "user",
            "content": [{"text": prompt}]
        }
    ]

    try:
        response = bedrock_client.converse(
            modelId="meta.llama3-70b-instruct-v1:0",
            messages=messages,
            inferenceConfig={
                "maxTokens": 1024,
                "temperature": 0.0
            }
        )
        response_text = response['output']['message']['content'][0]['text']
        
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            if "```json" in response_text:
                cleaned_text = response_text.split("```json")[1].split("```")[0].strip()
                return json.loads(cleaned_text)
            return json.loads(response_text) 
            
    except Exception as e:
        print(f"AWS Bedrock Llama generate_text error: {e}")
        return {}
