import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

from dotenv import load_dotenv

load_dotenv()

import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin
def init_firebase():
    if not firebase_admin._apps:
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        project_id = os.getenv("FIREBASE_PROJECT_ID")

        # 1. Primary: Environment variables (Render / Cloud deployment)
        if private_key and client_email and project_id:
            formatted_private_key = private_key.replace("\\n", "\n")
            cred_dict = {
                "type": "service_account",
                "project_id": project_id,
                "private_key": formatted_private_key,
                "client_email": client_email,
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized via environment variables.")
            return

        # 2. Local json file approach (only if file actually exists on disk)
        g_creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if g_creds and os.path.exists(g_creds):
            cred = credentials.Certificate(g_creds)
            firebase_admin.initialize_app(cred)
            logger.info(f"Firebase Admin initialized from file: {g_creds}")
            return

        # 3. Application Default Credentials fallback
        try:
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized with Application Default Credentials.")
        except Exception as e:
            logger.warning(f"Could not initialize Application Default Credentials: {e}. Initializing default app.")
            firebase_admin.initialize_app()

init_firebase()

# Export firestore client
db = firestore.client()

