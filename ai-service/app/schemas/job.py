from pydantic import BaseModel


class JobRequest(BaseModel):
    job_description: str


class JobData(BaseModel):
    title: str
    required_skills: list[str]
    preferred_skills: list[str]
    experience_requirements: list[str]
    responsibilities: list[str]