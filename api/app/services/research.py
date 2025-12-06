from typing import List
from agents import (
    Agent,
    ModelSettings,
    Runner,
    WebSearchTool,
    trace,
)
from app.schemas.research import QuestionAnswer, ResearchQuestionsResult
from pydantic import BaseModel


RESEARCH_PROMPT_TEMPLATE = """
You are researching a company. Use the web search tool to find information from or about this company website: {company_website}

Answer each of the following questions based on your research. Provide clear, concise answers.

Questions:
{questions_text}

Format your response as numbered answers matching the question numbers.
"""


class ResearchAgentConfig(BaseModel):
    name: str = "ResearchAgent"
    instructions: str = (
        "You are a company research assistant. Use the web search tool to find information "
        "from or about the specified company website. Provide clear, concise, and accurate "
        "answers based on your research findings. Always cite the source when possible."
    )
    model: str = "gpt-4o-mini"


class ResearchService:
    def __init__(
        self,
        agent_config: ResearchAgentConfig,
    ):
        self._agent_config = agent_config
        self._agent = self._create_agent()

    def _create_agent(self) -> Agent[ResearchQuestionsResult]:
        return Agent[ResearchQuestionsResult](
            name=self._agent_config.name,
            instructions=self._agent_config.instructions,
            model=self._agent_config.model,
            tools=[WebSearchTool()],
            model_settings=ModelSettings(tool_choice="required"),
            output_type=ResearchQuestionsResult,
        )

    def _build_prompt(self, company_website: str, questions: List[str]) -> str:
        questions_text = "\n".join(
            f"{idx}. {question}" for idx, question in enumerate(questions, start=1)
        )
        return RESEARCH_PROMPT_TEMPLATE.format(
            company_website=company_website,
            questions_text=questions_text,
        )

    async def research_questions(
        self, company_website: str, questions: List[str]
    ) -> List[QuestionAnswer]:
        prompt = self._build_prompt(company_website, questions)
        with trace("research-questions"):
            result = await Runner.run(self._agent, prompt)

        return [QuestionAnswer(**answer) for answer in result.final_output.answers]


def get_research_service() -> ResearchService:
    return ResearchService(ResearchAgentConfig())
