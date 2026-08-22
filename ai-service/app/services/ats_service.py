from app.schemas.resume import ResumeData
from app.schemas.job import JobData
from app.schemas.ats import ATSAnalysis

from app.services.skill_matching_service import (
    calculate_combined_skill_match
)

from app.services.llm_service import llm


def generate_ats_analysis(
    resume: ResumeData,
    job: JobData
) -> ATSAnalysis:

    skill_result = calculate_combined_skill_match(
        resume,
        job
    )

    matches = skill_result["matches"]
    missing_skills = skill_result["missing_skills"]
    skill_score = skill_result["skill_score"]

    matched_skills = [
        match["resume_skill"]
        for match in matches
        if match["match_type"] == "exact"
    ]

    semantic_matches = [
        match["job_skill"]
        for match in matches
        if match["match_type"] == "semantic"
    ]

    prompt = f"""
You are an expert technical recruiter.

Analyze the candidate against the job description.

The backend has already calculated the objective skill score.
Do NOT change the score.

SKILL SCORE:
{skill_score}

MATCHED SKILLS:
{matched_skills}

SEMANTIC MATCHES:
{semantic_matches}

MISSING SKILLS:
{missing_skills}

RESUME SUMMARY:
{resume.summary}

PROJECTS:
{resume.projects}

EXPERIENCE:
{resume.experience}

JOB:
{job.title}

RESPONSIBILITIES:
{job.responsibilities}

Provide:

1. Strengths
2. Practical resume improvement suggestions

Do not invent candidate experience.
"""

    response = llm.invoke(prompt)

    return ATSAnalysis(
        ats_score=skill_score,
        matched_skills=matched_skills,
        semantic_matches=semantic_matches,
        missing_skills=missing_skills,
        strengths=[
            response.content
        ],
        suggestions=[]
    )