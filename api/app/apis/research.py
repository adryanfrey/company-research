import logging

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.schemas.research import (
    PostResearchQuestionsRequest,
    ResearchQuestionsResult,
)
from app.schemas.api_response_models import BaseResponseModel, ErrorResponseModel
from app.services.research import get_research_service, ResearchService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/",
    responses={
        500: {"description": "Internal server error", "model": ErrorResponseModel},
    },
    response_model=BaseResponseModel[ResearchQuestionsResult],
)
async def research_questions(
    request: PostResearchQuestionsRequest,
    research_service: ResearchService = Depends(get_research_service),
) -> BaseResponseModel[ResearchQuestionsResult] | JSONResponse:
    try:
        answers = await research_service.research_questions(
            company_website=request.company_website,
            questions=request.questions,
        )
        return BaseResponseModel[ResearchQuestionsResult](
            message="success",
            result=ResearchQuestionsResult(answers=answers),
        )
    except Exception as e:
        logger.error(f"Error processing research request: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "There was an internal error"},
        )
