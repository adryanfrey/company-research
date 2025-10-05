from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import asyncio

from app.services.mock_answers import get_mock_answer

app = FastAPI()

# Configure CORS to allow requests from React
# Not secure, but sufficient for this assignment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchResult(BaseModel):
    question: str
    answer: str


@app.post("/api/research")
async def research_questions(questions: List[str]) -> List[ResearchResult]:
    # Simulate processing delay
    await asyncio.sleep(2)

    # Filter out empty questions and generate results
    results = [
        ResearchResult(
            question=q_text,
            answer=get_mock_answer(q_text)
        )
        for q_text in questions
        if q_text.strip() != ""
    ]

    return results
