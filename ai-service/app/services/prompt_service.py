from langchain_core.prompts import ChatPromptTemplate


resume_analysis_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are an expert technical recruiter and ATS resume analyzer.

Analyze resumes objectively.
Focus on:
- Technical skills
- Experience
- Projects
- Education
- Resume clarity
- ATS compatibility
"""
        ),
        (
            "human",
            """
Analyze the following resume:

{resume_text}
"""
        ),
    ]
)