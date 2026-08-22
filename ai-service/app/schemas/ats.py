from pydantic import BaseModel, Field


class ATSScoreBreakdown(BaseModel):
    skill_score: float
    project_score: float
    experience_score: float | None
    final_score: float = Field(ge=0, le=100)


class ATSAnalysis(BaseModel):
    score: ATSScoreBreakdown

    matched_skills: list[str]

    semantic_matches: list[str]

    missing_skills: list[str]

    project_relevance: list[str]

    experience_relevance: list[str]

    strengths: list[str]

    suggestions: list[str]