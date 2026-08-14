import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
def init_firebase():
    if not firebase_admin._apps:
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        project_id = os.getenv("FIREBASE_PROJECT_ID")

        if private_key and client_email and project_id:
            # Format private key replacing literal escaped newlines if present
            formatted_private_key = private_key.replace("\\n", "\n")
            cred_dict = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": formatted_private_key,
                "client_email": client_email,
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        elif os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
            cred = credentials.Certificate(os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
            firebase_admin.initialize_app(cred)
        else:
            try:
                cred = credentials.ApplicationDefault()
                firebase_admin.initialize_app(cred)
            except Exception:
                firebase_admin.initialize_app()

init_firebase()

# Export firestore client
db = firestore.client()

