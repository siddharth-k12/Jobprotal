from fastapi import APIRouter

from app.schemas.matching import SemanticMatchResult
from app.services.semantic_matching_service import (
    semantic_match_skills
)


router = APIRouter(
    prefix="/semantic",
    tags=["Semantic Matching"]
)


@router.post(
    "/skills",
    response_model=SemanticMatchResult
)
def semantic_match(
    resume_skills: list[str],
    job_skills: list[str]
):
    return semantic_match_skills(
        resume_skills,
        job_skills
    )