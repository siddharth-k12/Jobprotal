from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

from app.schemas.job import JobData


load_dotenv()


llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0,
    timeout=30,
    max_retries=2
)

structured_llm = llm.with_structured_output(
    JobData
)


def extract_job_data(
    job_description: str
) -> JobData:

    prompt = f"""
You are an expert job description parser.

Extract structured information from the following job description.

Rules:

- Do not invent requirements.
- Separate required skills from preferred skills.
- Keep each skill as an individual item.
- Extract experience requirements.
- Extract the main responsibilities.
- Return only information actually present in the job description.

JOB DESCRIPTION:

{job_description}
"""

    try:

        return structured_llm.invoke(
            prompt
        )

    except Exception as error:

        print(
            f"Job extraction error: {error}"
        )

        raise RuntimeError(
            "Job description AI extraction failed"
        ) from error