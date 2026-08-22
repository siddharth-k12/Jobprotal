from app.schemas.resume import ResumeData
from app.schemas.job import JobData
from app.services.semantic_matching_service import (
    semantic_match_skills
)


def normalize_skill(skill: str) -> str:
    return skill.strip().lower()


def calculate_combined_skill_match(
    resume: ResumeData,
    job: JobData
):
    resume_skills = {
        normalize_skill(skill): skill
        for skill in resume.skills
    }

    required_skills = {
        normalize_skill(skill): skill
        for skill in job.required_skills
    }

    exact_matches = []

    remaining_job_skills = []

    used_resume_skills = set()

    # First: exact matching
    for normalized_job, original_job in required_skills.items():

        if normalized_job in resume_skills:

            original_resume = resume_skills[
                normalized_job
            ]

            exact_matches.append({
                "job_skill": original_job,
                "resume_skill": original_resume,
                "match_type": "exact",
                "similarity": 1.0
            })

            used_resume_skills.add(normalized_job)

        else:
            remaining_job_skills.append(
                original_job
            )

    # Remaining resume skills
    remaining_resume_skills = [
        original
        for normalized, original in resume_skills.items()
        if normalized not in used_resume_skills
    ]

    # Second: semantic matching
    semantic_result = semantic_match_skills(
        remaining_resume_skills,
        remaining_job_skills
    )

    semantic_matches = []

    for match in semantic_result["matches"]:

        semantic_matches.append({
            "job_skill": match["job_skill"],
            "resume_skill": match["resume_skill"],
            "match_type": "semantic",
            "similarity": match["similarity"]
        })

    all_matches = (
        exact_matches +
        semantic_matches
    )

    matched_count = len(all_matches)
    required_count = len(required_skills)

    if required_count:
        skill_score = (
            matched_count / required_count
        ) * 100
    else:
        skill_score = 100

    return {
        "matches": all_matches,
        "missing_skills": semantic_result["unmatched"],
        "skill_score": round(skill_score, 2)
    }