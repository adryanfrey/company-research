from typing import List
from pydantic import BaseModel


class PostResearchQuestionsRequest(BaseModel):
    company_website: str
    questions: List[str]


class QuestionAnswer(BaseModel):
    question: str
    answer: str


class ResearchQuestionsResult(BaseModel):
    answers: List[QuestionAnswer]
