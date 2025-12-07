from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    OPENAI_API_KEY: str
    global_llm_model: str


settings = Settings()  # type: ignore[call-arg]
