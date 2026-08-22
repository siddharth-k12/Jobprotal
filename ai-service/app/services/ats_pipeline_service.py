from app.schemas.resume import ResumeData
from app.schemas.job import JobData

from app.services.skill_matching_service import (
    calculate_combined_skill_match
)

from app.services.project_matching_service import (
    calculate_project_relevance
)

from app.services.experience_matching_service import (
    calculate_experience_relevance
)


def calculate_ats_components(
    resume: ResumeData,
    job: JobData
):
    skill_result = calculate_combined_skill_match(
        resume,
        job
    )

    project_result = calculate_project_relevance(
        resume,
        job
    )

    experience_result = calculate_experience_relevance(
        resume,
        job
    )

    return {
        "skill": skill_result,
        "project": project_result,
        "experience": experience_result
    }