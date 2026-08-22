#mistral-small-2506
from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

from app.schemas.ats import ATSAnalysis

load_dotenv()


llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0
)

structured_llm = llm.with_structured_output(ATSAnalysis)


def analyze_resume(
    resume_text: str,
    job_description: str
) -> ATSAnalysis:

    prompt = f"""
You are an expert ATS resume analyzer and technical recruiter.

Compare the candidate's resume against the job description.

Analyze:

- ATS compatibility
- Matching technical skills
- Missing technical skills
- Candidate strengths
- Specific improvement suggestions

Give an ATS score from 0 to 100.

Important:
- Only consider skills actually present in the resume as matched skills.
- Do not invent candidate experience.
- Missing skills should come from requirements in the job description.
- Keep suggestions practical and specific.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
"""

    return structured_llm.invoke(prompt)