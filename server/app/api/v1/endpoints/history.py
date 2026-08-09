from fastapi import APIRouter, Depends, HTTPException, status
from app.models.history import HistoryListResponse
from app.services import history_service
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/history", tags=["Consultation History"])

@router.get("", response_model=HistoryListResponse)
def get_history(current_user = Depends(get_current_user)):
    """
    Fetches the authenticated user's consultation log history.
    """
    try:
        return history_service.get_history(current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{id}")
def delete_history_item(id: str, current_user = Depends(get_current_user)):
    """
    Removes a consultation entry from the history log.
    """
    try:
        deleted = history_service.delete_history(
            history_id=id,
            user_id=current_user.id
        )
        
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="History item not found or unauthorized to delete."
            )
            
        return {"status": "success", "message": "History record deleted successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
