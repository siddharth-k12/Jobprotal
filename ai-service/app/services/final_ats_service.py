from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from pydantic import BaseModel

from app.schemas.ats import ATSAnalysis
from app.schemas.resume import ResumeData
from app.schemas.job import JobData

from app.services.ats_pipeline_service import (
    calculate_ats_components
)

from app.services.ats_scoring_service import (
    calculate_final_ats_score
)


load_dotenv()


llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0,
    timeout=30,
    max_retries=2
)


class ATSExplanation(BaseModel):
    strengths: list[str]
    suggestions: list[str]


structured_llm = llm.with_structured_output(
    ATSExplanation
)


def generate_final_ats_analysis(
    resume: ResumeData,
    job: JobData
) -> ATSAnalysis:

    # Calculate matching components ONCE
    components = calculate_ats_components(
        resume,
        job
    )

    skill_result = components["skill"]
    project_result = components["project"]
    experience_result = components["experience"]

    # Calculate final score using existing results
    score_result = calculate_final_ats_score(
        resume,
        job,
        components
    )

    matched_skills = [
        item["resume_skill"]
        for item in skill_result["matches"]
        if item["match_type"] == "exact"
    ]

    semantic_matches = [
        item["job_skill"]
        for item in skill_result["matches"]
        if item["match_type"] == "semantic"
    ]

    project_relevance = [
        f"{item['project']}: {item['score']}%"
        for item in project_result["projects"]
    ]

    experience_relevance = [
        f"{item['role']} at {item['company']}: "
        f"{item['score']}%"
        for item in experience_result["experience"]
    ]

    prompt = f"""
You are an expert technical recruiter.

Analyze the candidate against the job description.

The backend has already calculated the numerical ATS score.

IMPORTANT:
- Do not change the numerical score.
- Do not invent skills.
- Do not invent experience.
- Do not invent achievements.
- Base your analysis only on the supplied information.
- Give practical resume improvement suggestions.

JOB TITLE:
{job.title}

REQUIRED SKILLS:
{job.required_skills}

PREFERRED SKILLS:
{job.preferred_skills}

MATCHED SKILLS:
{matched_skills}

SEMANTIC MATCHES:
{semantic_matches}

MISSING SKILLS:
{skill_result["missing_skills"]}

PROJECT RELEVANCE:
{project_relevance}

EXPERIENCE RELEVANCE:
{experience_relevance}

RESUME SUMMARY:
{resume.summary}

Return:

1. Strengths
2. Specific resume improvement suggestions
"""

    try:

        explanation = structured_llm.invoke(
            prompt
        )

    except Exception as error:

        raise RuntimeError(
            "ATS explanation generation failed"
        ) from error

    return ATSAnalysis(
        score=score_result,
        matched_skills=matched_skills,
        semantic_matches=semantic_matches,
        missing_skills=skill_result["missing_skills"],
        project_relevance=project_relevance,
        experience_relevance=experience_relevance,
        strengths=explanation.strengths,
        suggestions=explanation.suggestions
    )