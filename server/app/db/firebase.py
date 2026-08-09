import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

from dotenv import load_dotenv

# Load .env explicitly so GOOGLE_APPLICATION_CREDENTIALS is in os.environ
load_dotenv()

# Initialize Firebase Admin
def init_firebase():
    if not firebase_admin._apps:
        # We can use default credentials or a service account key
        # In development, you usually set GOOGLE_APPLICATION_CREDENTIALS in .env
        # Pointing to the firebase service account json file.
        cred = credentials.ApplicationDefault()
        try:
            firebase_admin.initialize_app(cred)
        except ValueError:
            # If default creds fail, maybe the user wants to pass it directly
            # For this project, we assume GOOGLE_APPLICATION_CREDENTIALS is set
            firebase_admin.initialize_app()

init_firebase()

# Export firestore client
db = firestore.client()
