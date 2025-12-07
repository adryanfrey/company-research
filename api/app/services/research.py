import asyncio
import json
from typing import List
from agents import (
    Agent,
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    ModelSettings,
    RunContextWrapper,
    RunResult,
    Runner,
    WebSearchTool,
    input_guardrail,
    output_guardrail,
    trace,
)
from app.schemas.research import QuestionAnswer, ResearchQuestionsResult
from pydantic import BaseModel
from app.prompts.research import (
    RESEARCH_INPUT_GUARDRAIL_INSTRUCTIONS,
    RESEARCH_OUTPUT_GUARDRAIL_INSTRUCTIONS,
    RESEARCH_PROMPT_TEMPLATE,
    RESEARCH_AGENT_INSTRUCTIONS,
)
from app.config import settings


class ResearchAgentConfig(BaseModel):
    name: str = "Research agent"
    instructions: str = RESEARCH_AGENT_INSTRUCTIONS
    model: str = settings.global_llm_model
    timeout: float = 20.0


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
            input_guardrails=[self._create_input_guardrail()],
            output_guardrails=[self._create_output_guardrail()],
        )

    def _create_input_guardrail(self):
        class GuardrailResult(BaseModel):
            is_input_safe: bool
            reasoning: str

        agent = Agent[GuardrailResult](
            name="Research input guardrail agent",
            instructions=RESEARCH_INPUT_GUARDRAIL_INSTRUCTIONS,
            model=settings.global_llm_model,
            output_type=GuardrailResult,
        )

        @input_guardrail
        async def input_guardrail_fn(
            ctx: RunContextWrapper, _agent: Agent, input: str
        ) -> GuardrailFunctionOutput:
            result = await self._run_with_timeout(
                agent, input, ctx.context, self._agent_config.timeout
            )
            return GuardrailFunctionOutput(
                output_info=result.final_output,
                tripwire_triggered=not result.final_output.is_input_safe,
            )

        return input_guardrail_fn

    def _create_output_guardrail(self):
        class GuardrailResult(BaseModel):
            is_output_safe: bool
            reasoning: str

        agent = Agent[GuardrailResult](
            name="Research output guardrail agent",
            instructions=RESEARCH_OUTPUT_GUARDRAIL_INSTRUCTIONS,
            model=settings.global_llm_model,
            output_type=GuardrailResult,
        )

        @output_guardrail
        async def output_guardrail_fn(
            ctx: RunContextWrapper, _agent: Agent, output: ResearchQuestionsResult
        ) -> GuardrailFunctionOutput:
            result = await self._run_with_timeout(
                agent,
                json.dumps([item.model_dump() for item in output]),
                ctx.context,
                self._agent_config.timeout,
            )
            return GuardrailFunctionOutput(
                output_info=result.final_output,
                tripwire_triggered=not result.final_output.is_output_safe,
            )

        return output_guardrail_fn

    def _build_prompt(self, company_website: str, questions: List[str]) -> str:
        questions_text = "\n".join(
            f"{idx}. {question}" for idx, question in enumerate(questions, start=1)
        )
        return RESEARCH_PROMPT_TEMPLATE.format(
            company_website=company_website,
            questions_text=questions_text,
        )

    async def _run_with_timeout(
        self,
        agent: Agent,
        prompt: str,
        context: dict,
        timeout: float,
    ) -> RunResult:
        result = await asyncio.wait_for(
            Runner.run(agent, prompt, context=context),
            timeout=timeout,
        )
        return result

    async def research_questions(
        self, company_website: str, questions: List[str]
    ) -> List[QuestionAnswer]:
        prompt = self._build_prompt(company_website, questions)

        with trace("research-questions"):
            result = await self._run_with_timeout(
                self._agent,
                prompt,
                {},
                self._agent_config.timeout,
            )

        return result.final_output


def get_research_service() -> ResearchService:
    return ResearchService(ResearchAgentConfig())


if __name__ == "__main__":
    research_service = get_research_service()

    async def main():
        answers = await research_service.research_questions(
            company_website="https://www.salaciasolutions.com",
            questions=[
                "What is the company's mission?",
                "What is the company's vision?",
                "What is the company's values?",
            ],
        )
        print(answers)

    asyncio.run(main())
