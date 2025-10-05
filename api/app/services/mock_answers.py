import random


def get_mock_answer(question: str) -> str:
    """Generate a mock answer based on the question."""
    mock_answers = [
        f"Based on recent research, {question.lower()} has shown significant developments in the field. "
        "Multiple studies indicate promising results with various applications.",

        f"Analysis of {question.lower()} reveals interesting patterns. "
        "Current data suggests this is an area worth exploring further with comprehensive methodology.",

        f"The topic of {question.lower()} has been extensively studied. "
        "Evidence points to multiple factors contributing to the overall understanding of this subject.",

        f"Research findings on {question.lower()} demonstrate compelling insights. "
        "The scientific community continues to investigate various aspects of this phenomenon.",
    ]
    return random.choice(mock_answers)

