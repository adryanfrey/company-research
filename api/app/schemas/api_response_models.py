from typing import Generic, TypeVar
from pydantic import BaseModel, Field


T = TypeVar("T")


class BaseResponseModel(BaseModel, Generic[T]):
    """Base response model for all successful API responses."""

    message: str
    result: T


class ErrorResponseModel(BaseModel):
    """Schema for error responses in API documentation."""

    detail: str = Field(..., description="Error message describing what went wrong")
