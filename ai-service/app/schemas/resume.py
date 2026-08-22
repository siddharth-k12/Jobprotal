from pydantic import BaseModel


class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class Project(BaseModel):
    name: str
    technologies: list[str]
    description: str


class ResumeData(BaseModel):
    name: str
    summary: str
    skills: list[str]
    experience: list[Experience]
    education: list[str]
    projects: list[Project]
    certifications: list[str]