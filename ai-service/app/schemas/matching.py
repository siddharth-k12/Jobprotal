from pydantic import BaseModel

from app.schemas.resume import ResumeData
from app.schemas.job import JobData


class MatchingRequest(BaseModel):
    resume: ResumeData
    job: JobData


class SkillMatchResult(BaseModel):
    matched_required: list[str]
    missing_required: list[str]
    matched_preferred: list[str]
    required_match_percentage: float


class ATSScore(BaseModel):
    required_skills_score: float
    preferred_skills_score: float
    experience_score: float
    projects_score: float
    education_score: float
    final_score: float

class SemanticMatch(BaseModel):
    job_skill: str
    resume_skill: str
    similarity: float


class SemanticMatchResult(BaseModel):
    matches: list[SemanticMatch]
    unmatched: list[str]

class EmbeddingRequest(BaseModel):
    texts: list[str]

class CombinedSkillMatch(BaseModel):
    job_skill: str
    resume_skill: str | None
    match_type: str
    similarity: float | None


class CombinedSkillResult(BaseModel):
    matches: list[CombinedSkillMatch]
    missing_skills: list[str]
    skill_score: float


class ProjectRelevance(BaseModel):
    project: str
    score: float


class ProjectRelevanceResult(BaseModel):
    projects: list[ProjectRelevance]
    average_score: float

class ExperienceRelevance(BaseModel):
    company: str
    role: str
    score: float


class ExperienceRelevanceResult(BaseModel):
    experience: list[ExperienceRelevance]
    average_score: float | None

class ATSFinalScore(BaseModel):
    skill_score: float
    project_score: float
    experience_score: float | None
    final_score: float