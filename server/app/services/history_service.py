from typing import Union, List, Dict, Any
from app.db.firebase import db
from firebase_admin import firestore
from app.models.history import HistoryItem, HistoryListResponse
import datetime

def save_history(user_id: str, type: str, result: Union[Dict[str, Any], List[Any]]) -> HistoryItem:
    """
    Inserts a new consultation history record for a user into the Firestore 'history' collection.
    """
    try:
        doc_ref = db.collection("history").document()
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        doc_data = {
            "id": doc_ref.id,
            "user_id": user_id,
            "type": type,
            "result": result,
            "created_at": now
        }
        
        doc_ref.set(doc_data)
        
        return HistoryItem(
            id=doc_ref.id,
            user_id=user_id,
            type=type,
            result=result,
            created_at=now
        )
    except Exception as e:
        raise Exception(f"Failed to save history: {str(e)}")


def get_history(user_id: str) -> HistoryListResponse:
    """
    Fetches all history logs for a specific user, sorted by 'created_at' in descending order.
    """
    try:
        # Note: Depending on your Firebase rules and indexing, 
        # combining where() and order_by() on different fields may require a composite index.
        # Firebase will provide a direct link in the error to create it if it fails.
        docs = db.collection("history") \
            .where("user_id", "==", user_id) \
            .order_by("created_at", direction=firestore.Query.DESCENDING) \
            .stream()
            
        items = []
        for doc in docs:
            data = doc.to_dict()
            items.append(HistoryItem(
                id=data.get("id", doc.id),
                user_id=data.get("user_id", ""),
                type=data.get("type", ""),
                result=data.get("result", {}),
                created_at=data.get("created_at", "")
            ))
            
        return HistoryListResponse(items=items)
    except Exception as e:
        raise Exception(f"Failed to fetch history: {str(e)}")


def delete_history(history_id: str, user_id: str) -> bool:
    """
    Deletes a specific history record belonging to the given user.
    """
    try:
        doc_ref = db.collection("history").document(history_id)
        doc = doc_ref.get()
        
        if doc.exists and doc.to_dict().get("user_id") == user_id:
            doc_ref.delete()
            return True
            
        return False
    except Exception as e:
        raise Exception(f"Failed to delete history item: {str(e)}")
