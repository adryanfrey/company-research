from typing import List, Annotated
from pydantic import BaseModel, Field, field_validator
from app.utils.is_valid_https_url import is_valid_https_url


class PostResearchQuestionsRequest(BaseModel):
    company_website: Annotated[
        str,
        Field(
            min_length=1,
            max_length=2048,
            description="Company website URL (must be HTTPS)",
        ),
    ]
    questions: Annotated[
        List[str],
        Field(
            min_length=1,
            max_length=3,
            description=f"List of questions to research about the company (1-3 questions)",
        ),
    ]

    @field_validator("company_website")
    @classmethod
    def validate_company_website(cls, v: str) -> str:
        if not is_valid_https_url(v):
            raise ValueError(
                f"Company website must be a valid HTTPS URL. Received: {v}"
            )
        return v

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "company_website": "https://www.example.com",
                    "questions": [
                        "What is the company's mission?",
                        "What products does the company offer?",
                    ],
                }
            ]
        }
    }


class QuestionAnswer(BaseModel):
    question: str
    answer: str
    sources: List[str]


ResearchQuestionsResult = List[QuestionAnswer]
