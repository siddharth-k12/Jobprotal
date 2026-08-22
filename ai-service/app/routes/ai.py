from fastapi import APIRouter

from app.schemas.ai import AIRequest, AIResponse
from app.services.llm_service import ask_llm

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/chat", response_model=AIResponse)
def chat_with_ai(data: AIRequest):
    response = ask_llm(data.prompt)

    return AIResponse(
        response=response
    )