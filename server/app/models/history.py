from pydantic import BaseModel
from typing import List, Dict, Any, Union
from datetime import datetime

class HistoryItem(BaseModel):
    id: str
    user_id: str
    type: str
    result: Union[Dict[str, Any], List[Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class HistoryListResponse(BaseModel):
    items: List[HistoryItem]
