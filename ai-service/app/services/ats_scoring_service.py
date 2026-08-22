from app.schemas.resume import ResumeData
from app.schemas.job import JobData


def calculate_final_ats_score(
    resume: ResumeData,
    job: JobData,
    components: dict
):

    # =====================================================
    # GET COMPONENTS
    # =====================================================

    skill_result = components.get(
        "skill",
        {}
    )

    project_result = components.get(
        "project",
        {}
    )

    experience_result = components.get(
        "experience",
        {}
    )


    # =====================================================
    # SKILL SCORE
    # =====================================================

    skill_score = skill_result.get(
        "required_match_percentage",
        skill_result.get(
            "skill_score",
            0
        )
    )


    # =====================================================
    # PROJECT SCORE
    # =====================================================

    project_score = project_result.get(
        "average_score",
        project_result.get(
            "project_score",
            0
        )
    )


    # =====================================================
    # EXPERIENCE SCORE
    # =====================================================

    experience_score = experience_result.get(
        "average_score",
        experience_result.get(
            "experience_score",
            None
        )
    )


    # =====================================================
    # NORMALIZE SCORES
    # =====================================================

    skill_score = float(
        skill_score or 0
    )

    project_score = float(
        project_score or 0
    )


    if experience_score is not None:

        experience_score = float(
            experience_score
        )


    # =====================================================
    # EDUCATION SCORE
    # =====================================================

    education_score = (
        100
        if resume.education
        else 0
    )


    # =====================================================
    # RESUME QUALITY
    # =====================================================

    resume_quality_score = 80


    # =====================================================
    # FINAL SCORE
    # =====================================================

    if experience_score is None:

        # ---------------------------------------------
        # FRESHER
        # ---------------------------------------------

        final_score = (

            skill_score * 0.55

            + project_score * 0.25

            + education_score * 0.10

            + resume_quality_score * 0.10

        )

    else:

        # ---------------------------------------------
        # EXPERIENCED
        # ---------------------------------------------

        final_score = (

            skill_score * 0.50

            + experience_score * 0.20

            + project_score * 0.10

            + education_score * 0.10

            + resume_quality_score * 0.10

        )


    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "skill_score": round(
            min(skill_score, 100),
            2
        ),

        "project_score": round(
            min(project_score, 100),
            2
        ),

        "experience_score": (

            round(
                min(experience_score, 100),
                2
            )

            if experience_score is not None

            else None
        ),

        "education_score": round(
            min(education_score, 100),
            2
        ),

        "final_score": round(
            min(max(final_score, 0), 100),
            2
        )

    }