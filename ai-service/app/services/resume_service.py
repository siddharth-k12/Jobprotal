from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

from app.schemas.resume import ResumeData


load_dotenv()


llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0,
    timeout=30,
    max_retries=2
)


structured_llm = llm.with_structured_output(
    ResumeData
)


def extract_resume_data(
    resume_text: str
) -> ResumeData:

    prompt = f"""
You are an expert resume parser.

Extract structured information from this resume.

Rules:

- Do not invent information.
- If information is missing, use an empty string or empty list.
- Extract every relevant technical skill.
- For experience, identify company, role, duration and description.
- For projects, identify project name, technologies and description.
- Keep technologies as individual items.
- Return only information actually present in the resume.

RESUME:

{resume_text}
"""

    try:

        return structured_llm.invoke(
            prompt
        )

    except Exception as error:

        print(
            f"Resume extraction error: {error}"
        )

        raise RuntimeError(
            "Resume AI extraction failed"
        ) from error