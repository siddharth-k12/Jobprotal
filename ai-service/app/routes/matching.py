from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.schemas.matching import (
    MatchingRequest,
    SkillMatchResult,
    ATSScore,
    ATSFinalScore,
    ProjectRelevanceResult,
    ExperienceRelevanceResult,
    CombinedSkillResult
)

from app.services.ats_scoring_service import (
    calculate_final_ats_score
)

from app.services.project_matching_service import (
    calculate_project_relevance
)

from app.services.matching_service import (
    calculate_skill_match,
    calculate_ats_score
)

from app.services.experience_matching_service import (
    calculate_experience_relevance
)

from app.services.skill_matching_service import (
    calculate_combined_skill_match
)


router = APIRouter(
    prefix="/matching",
    tags=["Matching"]
)


# =====================================================
# SKILL MATCH
# =====================================================

@router.post(
    "/skills",
    response_model=SkillMatchResult
)
def match_skills(data: MatchingRequest):

    return calculate_skill_match(
        data.resume,
        data.job
    )


# =====================================================
# ATS SCORE
# =====================================================

@router.post(
    "/score",
    response_model=ATSScore
)
def calculate_score(data: MatchingRequest):

    return calculate_ats_score(
        data.resume,
        data.job
    )


# =====================================================
# COMBINED MATCH
# =====================================================

@router.post(
    "/combined",
    response_model=CombinedSkillResult
)
def combined_match(data: MatchingRequest):

    return calculate_combined_skill_match(
        data.resume,
        data.job
    )


# =====================================================
# PROJECT MATCH
# =====================================================

@router.post(
    "/projects",
    response_model=ProjectRelevanceResult
)
def project_relevance(data: MatchingRequest):

    return calculate_project_relevance(
        data.resume,
        data.job
    )


# =====================================================
# EXPERIENCE MATCH
# =====================================================

@router.post(
    "/experience",
    response_model=ExperienceRelevanceResult
)
def experience_relevance(data: MatchingRequest):

    return calculate_experience_relevance(
        data.resume,
        data.job
    )


# =====================================================
# FINAL ATS SCORE
# =====================================================

@router.post(
    "/ats-score",
    response_model=ATSFinalScore
)
def calculate_final_score(
    data: MatchingRequest
):

    # Calculate required components first

    skill_result = calculate_skill_match(
        data.resume,
        data.job
    )

    project_result = calculate_project_relevance(
        data.resume,
        data.job
    )

    experience_result = calculate_experience_relevance(
        data.resume,
        data.job
    )

    components = {
        "skill": skill_result,
        "project": project_result,
        "experience": experience_result
    }

    return calculate_final_ats_score(
        data.resume,
        data.job,
        components
    )


# =====================================================
# JD MATCH ANALYZER
#
# POST /matching/analyze
#
# Form-data:
# file              -> PDF resume
# job_description   -> Job description
# =====================================================

@router.post("/analyze")
async def analyze_job_match(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    try:

        print("\n")
        print("======================================")
        print("       JD MATCH ANALYZER")
        print("======================================")


        # =================================================
        # VALIDATE FILE
        # =================================================

        print(
            "File:",
            file.filename
        )

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="Resume file is required"
            )

        if not file.filename.lower().endswith(".pdf"):

            raise HTTPException(
                status_code=400,
                detail="Only PDF resumes are supported"
            )


        # =================================================
        # VALIDATE JD
        # =================================================

        if not job_description:

            raise HTTPException(
                status_code=400,
                detail="Job description is required"
            )

        job_description = job_description.strip()

        if not job_description:

            raise HTTPException(
                status_code=400,
                detail="Job description is required"
            )

        print(
            "JD characters:",
            len(job_description)
        )


        # =================================================
        # READ PDF
        # =================================================

        pdf_bytes = await file.read()

        print(
            "PDF bytes:",
            len(pdf_bytes)
        )

        if not pdf_bytes:

            raise HTTPException(
                status_code=400,
                detail="Resume PDF is empty"
            )


        # =================================================
        # RESUME PARSER
        # =================================================

        print(
            "Step 1: Parsing resume..."
        )

        try:

            from app.services.resume_parser_service import (
                parse_resume_pdf
            )

            resume_data = parse_resume_pdf(
                pdf_bytes
            )

        except ImportError as error:

            print(
                "Resume parser import error:",
                error
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "resume_parser_service.py "
                    "could not be imported"
                )
            )

        except Exception as error:

            print(
                "Resume parser error:",
                error
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Resume parsing failed: {str(error)}"
                )
            )


        print(
            "Resume parsed successfully"
        )

        print(
            "Resume name:",
            resume_data.name
        )

        print(
            "Resume skills:",
            resume_data.skills
        )

        print(
            "Resume projects:",
            len(resume_data.projects)
        )

        print(
            "Resume experience:",
            len(resume_data.experience)
        )


        # =================================================
        # JOB PARSER
        # =================================================

        print(
            "Step 2: Parsing job description..."
        )

        try:

            from app.services.job_parser_service import (
                parse_job_description
            )

            job_data = parse_job_description(
                job_description
            )

        except ImportError as error:

            print(
                "Job parser import error:",
                error
            )

            raise HTTPException(
                status_code=500,
                detail=(
                    "job_parser_service.py "
                    "could not be imported"
                )
            )

        except Exception as error:

            print(
                "Job parser error:",
                error
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Job parsing failed: {str(error)}"
                )
            )


        print(
            "Job parsed successfully"
        )

        print(
            "Job title:",
            job_data.title
        )

        print(
            "Required skills:",
            job_data.required_skills
        )

        print(
            "Preferred skills:",
            job_data.preferred_skills
        )


        # =================================================
        # SKILL MATCH
        # =================================================

        print(
            "Step 3: Skill matching..."
        )

        skill_result = calculate_skill_match(
            resume_data,
            job_data
        )

        print(
            "Skill result:",
            skill_result
        )


        # =================================================
        # COMBINED SKILL MATCH
        # =================================================

        print(
            "Step 4: Combined skill matching..."
        )

        combined_result = (
            calculate_combined_skill_match(
                resume_data,
                job_data
            )
        )

        print(
            "Combined result:",
            combined_result
        )


        # =================================================
        # PROJECT RELEVANCE
        # =================================================

        print(
            "Step 5: Project matching..."
        )

        project_result = (
            calculate_project_relevance(
                resume_data,
                job_data
            )
        )

        print(
            "Project result:",
            project_result
        )


        # =================================================
        # EXPERIENCE RELEVANCE
        # =================================================

        print(
            "Step 6: Experience matching..."
        )

        experience_result = (
            calculate_experience_relevance(
                resume_data,
                job_data
            )
        )

        print(
            "Experience result:",
            experience_result
        )


        # =================================================
        # BUILD COMPONENTS
        # =================================================

        print(
            "Step 7: Building ATS components..."
        )

        components = {

            "skill": skill_result,

            "project": project_result,

            "experience": experience_result

        }

        print(
            "ATS components:",
            components
        )


        # =================================================
        # FINAL ATS SCORE
        # =================================================

        print(
            "Step 8: Calculating final ATS score..."
        )

        score_result = (
            calculate_final_ats_score(
                resume_data,
                job_data,
                components
            )
        )

        print(
            "Score result:",
            score_result
        )


        # =================================================
        # EXTRACT SKILLS
        # =================================================

        matched_required = skill_result.get(
            "matched_required",
            []
        )

        missing_required = skill_result.get(
            "missing_required",
            []
        )

        matched_preferred = skill_result.get(
            "matched_preferred",
            []
        )


        # =================================================
        # SCORE
        # =================================================

        final_score = score_result.get(
            "final_score",
            0
        )

        skill_score = score_result.get(
            "skill_score",
            0
        )

        project_score = score_result.get(
            "project_score",
            0
        )

        experience_score = score_result.get(
            "experience_score",
            0
        )


        # =================================================
        # SEMANTIC MATCHES
        # =================================================

        semantic_matches = []

        if isinstance(
            combined_result,
            dict
        ):

            semantic_matches = (
                combined_result.get(
                    "matches",
                    []
                )
            )


        # =================================================
        # PROJECT RELEVANCE
        # =================================================

        project_relevance = []

        if isinstance(
            project_result,
            dict
        ):

            project_relevance = (
                project_result.get(
                    "relevant_projects",
                    project_result.get(
                        "projects",
                        []
                    )
                )
            )


        # =================================================
        # EXPERIENCE RELEVANCE
        # =================================================

        experience_relevance = []

        if isinstance(
            experience_result,
            dict
        ):

            experience_relevance = (
                experience_result.get(
                    "relevant_experience",
                    experience_result.get(
                        "experience",
                        []
                    )
                )
            )


        # =================================================
        # STRENGTHS
        # =================================================

        strengths = []

        if matched_required:

            strengths.append(
                f"Matched {len(matched_required)} "
                "required skills."
            )

        if matched_preferred:

            strengths.append(
                f"Matched {len(matched_preferred)} "
                "preferred skills."
            )

        if project_relevance:

            strengths.append(
                "Resume contains relevant projects."
            )

        if experience_relevance:

            strengths.append(
                "Resume contains relevant experience."
            )

        if not strengths:

            strengths.append(
                "Resume analysis completed."
            )


        # =================================================
        # SUGGESTIONS
        # =================================================

        suggestions = []

        if missing_required:

            suggestions.append(
                "Add missing required skills "
                "when you genuinely have experience "
                "with them."
            )

        if not project_relevance:

            suggestions.append(
                "Add projects relevant to the "
                "target role."
            )

        if not experience_relevance:

            suggestions.append(
                "Add relevant internship or work "
                "experience where applicable."
            )

        suggestions.append(
            "Use job-specific terminology "
            "naturally in relevant resume sections."
        )

        suggestions.append(
            "Add measurable achievements "
            "to projects and experience."
        )


        # =================================================
        # FINAL RESPONSE
        # =================================================

        response = {

            "success": True,

            "job": {

                "title": job_data.title

            },

            "score": {

                "final_score": final_score,

                "skill_score": skill_score,

                "project_score": project_score,

                "experience_score": experience_score,

                "education_score": (
                    100
                    if resume_data.education
                    else 0
                )

            },

            "matched_skills": (
                matched_required
                + matched_preferred
            ),

            "missing_skills": (
                missing_required
            ),

            "semantic_matches": (
                semantic_matches
            ),

            "project_relevance": (
                project_relevance
            ),

            "experience_relevance": (
                experience_relevance
            ),

            "strengths": (
                strengths
            ),

            "suggestions": (
                suggestions
            )

        }


        print(
            "======================================"
        )

        print(
            "       JD MATCH SUCCESS"
        )

        print(
            "Score:",
            final_score
        )

        print(
            "======================================"
        )

        return response


    # =====================================================
    # HTTP ERROR
    # =====================================================

    except HTTPException:

        raise


    # =====================================================
    # UNEXPECTED ERROR
    # =====================================================

    except Exception as error:

        import traceback

        print(
            "\n======================================"
        )

        print(
            "       JD MATCH FAILED"
        )

        print(
            "ERROR:",
            str(error)
        )

        traceback.print_exc()

        print(
            "======================================\n"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                f"JD match analysis failed: {str(error)}"
            )
        )