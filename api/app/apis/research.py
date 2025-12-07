import logging

from agents import InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from app.schemas.research import ResearchQuestionsResult
from app.schemas.research import PostResearchQuestionsRequest
from app.schemas.api_response_models import BaseResponseModel, ErrorResponseModel
from app.services.research import get_research_service, ResearchService

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/",
    responses={
        403: {
            "description": "Request blocked by security guardrail",
            "model": ErrorResponseModel,
        },
        408: {"description": "Request timeout", "model": ErrorResponseModel},
        500: {"description": "Internal server error", "model": ErrorResponseModel},
    },
    summary="Research company information using AI-powered web search",
    description="Answer 1 to 3 custom questions about a company using an AI agent with web search. Provide the company's website and your questions.",
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
            message="Success",
            result=answers,
        )

    except (InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered) as e:
        logger.error(f"Request blocked by guardrail: {e.guardrail_result}")
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "detail": "Request blocked by guardrail. Please try again with a different input.",
            },
        )

    except TimeoutError as e:
        logger.error(f"Request timed out: {e}")
        return JSONResponse(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            content={"detail": "Request timed out"},
        )

    except Exception:
        logger.exception("Error processing research request")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "There was an internal error"},
        )
