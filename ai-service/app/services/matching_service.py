from app.schemas.resume import ResumeData
from app.schemas.job import JobData


def normalize_skill(skill: str) -> str:
    return skill.strip().lower()


def calculate_skill_match(
    resume: ResumeData,
    job: JobData
):
    resume_skills = {
        normalize_skill(skill)
        for skill in resume.skills
    }

    required_skills = {
        normalize_skill(skill)
        for skill in job.required_skills
    }

    preferred_skills = {
        normalize_skill(skill)
        for skill in job.preferred_skills
    }

    matched_required = resume_skills & required_skills
    missing_required = required_skills - resume_skills
    matched_preferred = resume_skills & preferred_skills

    if required_skills:
        required_match_percentage = (
            len(matched_required)
            / len(required_skills)
        ) * 100
    else:
        required_match_percentage = 100

    return {
        "matched_required": sorted(matched_required),
        "missing_required": sorted(missing_required),
        "matched_preferred": sorted(matched_preferred),
        "required_match_percentage": round(
            required_match_percentage,
            2
        )
    }


def calculate_ats_score(
    resume: ResumeData,
    job: JobData
):
    skill_result = calculate_skill_match(
        resume,
        job
    )

    required_score = skill_result[
        "required_match_percentage"
    ]

    if job.preferred_skills:

        preferred_skills = {
            normalize_skill(skill)
            for skill in job.preferred_skills
        }

        resume_skills = {
            normalize_skill(skill)
            for skill in resume.skills
        }

        matched_preferred = (
            resume_skills & preferred_skills
        )

        preferred_score = (
            len(matched_preferred)
            / len(preferred_skills)
        ) * 100

    else:
        preferred_score = 100

    experience_score = (
        100 if resume.experience else 0
    )

    projects_score = (
        100 if resume.projects else 0
    )

    education_score = (
        100 if resume.education else 0
    )

    resume_quality_score = 80

    final_score = (
        required_score * 0.50
        + preferred_score * 0.15
        + experience_score * 0.15
        + projects_score * 0.10
        + education_score * 0.05
        + resume_quality_score * 0.05
    )

    return {
        "required_skills_score": round(
            required_score,
            2
        ),
        "preferred_skills_score": round(
            preferred_score,
            2
        ),
        "experience_score": experience_score,
        "projects_score": projects_score,
        "education_score": education_score,
        "final_score": round(
            final_score,
            2
        )
    }