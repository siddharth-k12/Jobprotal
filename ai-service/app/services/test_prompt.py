from app.services.prompt_service import resume_analysis_prompt


def create_resume_prompt(resume_text: str):
    return resume_analysis_prompt.invoke(
        {
            "resume_text": resume_text
        }
    )