from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import json
from typing import Union, List
from app.models.analyze import (
    AnalyzeRequest, 
    SkincareResult, 
    FashionOutfit, 
    HairCareResult, 
    HairStylingResult
)
from app.services import skincare_service, fashion_service, hair_service, history_service
from app.core.dependencies import get_current_user
from app.core.config import settings

router = APIRouter(prefix="/analyze", tags=["AI Analysis"])

@router.post("/skincare", response_model=SkincareResult)
async def skincare_analysis(body: AnalyzeRequest, current_user = Depends(get_current_user)):
    """
    Performs AI dermatology scan, registers analysis in history, and returns recommendations.
    """
    if body.type != "skincare":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Endpoint expects type parameter to be 'skincare'."
        )
    # Enforce scan limits
    if history_service.check_scan_limit(current_user.id, type="skincare", max_scans=settings.SKINCARE_SCAN_LIMIT):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Since you are currently in a free tier, you can only perform 1 skincare scan every 24 hours. Please wait 1 day for your daily limit to refresh."
        )
    try:
        # Run skin analysis (passing the body context dictionary)
        result = await skincare_service.analyze_skincare(body.image_base64, body.context)
        
        # Save consultation log to Supabase history
        if result:
            history_service.save_history(
                user_id=current_user.id,
                type="skincare",
                result=result.model_dump()
            )

        
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/fashion")
async def fashion_analysis(body: AnalyzeRequest, current_user = Depends(get_current_user)):
    """
    Performs AI style consultation, calls image generator, and streams suggestions back to the client via SSE.
    """
    if body.type != "fashion":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Endpoint expects type parameter to be 'fashion'."
        )
    # Enforce scan limits
    if history_service.check_scan_limit(current_user.id, type="fashion", max_scans=settings.FASHION_SCAN_LIMIT):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Since you are currently in a free tier, you can only perform 1 style curation every 24 hours. Please wait 1 day for your daily limit to refresh."
        )
        
    async def event_generator():
        outfits = []
        try:
            # Iterate over the async generator yielding completed outfits
            async for outfit in fashion_service.analyze_fashion_stream(body.image_base64, body.context):
                outfits.append(outfit.model_dump())
                # Yield SSE format
                yield f"data: {json.dumps(outfit.model_dump())}\n\n"
                
            # After all outfits are yielded, save to history
            if outfits:
                history_service.save_history(
                    user_id=current_user.id,
                    type="fashion",
                    result=outfits
                )
            yield "event: close\ndata: {}\n\n"
        except Exception as e:
            # Yield error event
            error_data = json.dumps({"error": str(e)})
            yield f"event: error\ndata: {error_data}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/hair", response_model=Union[HairCareResult, HairStylingResult])
async def hair_analysis(body: AnalyzeRequest, current_user = Depends(get_current_user)):
    """
    Performs AI hair/scalp health diagnostic or styling lookup, logs details, and returns calendar or lookbook recommendations.
    """
    if body.type != "hair":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Endpoint expects type parameter to be 'hair'."
        )
    # Enforce scan limits
    if history_service.check_scan_limit(current_user.id, type="hair", max_scans=settings.HAIR_SCAN_LIMIT):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Since you are currently in a free tier, you can only perform 1 hair analysis every 24 hours. Please wait 1 day for your daily limit to refresh."
        )
    try:
        # Run hair analysis
        result = await hair_service.analyze_hair(body.image_base64, body.context)
        
        # Save consultation log to Supabase history
        history_service.save_history(
            user_id=current_user.id,
            type="hair",
            result=result.model_dump()
        )
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
