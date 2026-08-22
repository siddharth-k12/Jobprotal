import re

from app.schemas.job import JobData


# =====================================================
# COMMON TECH SKILLS
# =====================================================

COMMON_SKILLS = [
    "javascript",
    "typescript",
    "react",
    "react.js",
    "node.js",
    "nodejs",
    "express",
    "express.js",
    "mongodb",
    "mysql",
    "postgresql",
    "sql",
    "python",
    "java",
    "c++",
    "fastapi",
    "docker",
    "git",
    "github",
    "aws",
    "redis",
    "rest",
    "rest api",
    "html",
    "css",
    "tailwind",
    "redux",
    "redux toolkit",
    "machine learning",
    "artificial intelligence",
    "pandas",
    "numpy",
    "scikit-learn",
    "socket.io",
    "jwt",
    "cloudinary"
]


# =====================================================
# NORMALIZE TEXT
# =====================================================

def normalize_text(text: str) -> str:

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =====================================================
# EXTRACT SKILLS
# =====================================================

def extract_skills(text: str):

    normalized = normalize_text(text)

    found = []

    for skill in COMMON_SKILLS:

        skill_normalized = skill.lower()

        if skill_normalized in normalized:

            found.append(skill)

    return sorted(
        set(found)
    )


# =====================================================
# EXTRACT JOB TITLE
# =====================================================

def extract_job_title(text: str):

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return "Job Position"

    # Look for common title patterns

    for line in lines[:10]:

        lower = line.lower()

        if (
            "job title:" in lower
            or "position:" in lower
            or "role:" in lower
        ):

            parts = re.split(
                r":",
                line,
                maxsplit=1
            )

            if len(parts) == 2:

                title = parts[1].strip()

                if title:
                    return title

    # Common developer titles

    title_patterns = [
        "frontend developer",
        "backend developer",
        "full stack developer",
        "fullstack developer",
        "software developer",
        "software engineer",
        "react developer",
        "node.js developer",
        "nodejs developer",
        "python developer",
        "java developer",
        "devops engineer",
        "data analyst",
        "data scientist",
        "machine learning engineer",
        "ai engineer"
    ]

    normalized = normalize_text(text)

    for title in title_patterns:

        if title in normalized:

            return title.title()

    # Fallback

    return lines[0][:100]


# =====================================================
# REQUIRED SKILLS
# =====================================================

def extract_required_skills(text: str):

    normalized = normalize_text(text)

    skills = extract_skills(text)

    required = []

    # Try to locate required skills section

    required_match = re.search(
        r"(required skills|requirements|required qualifications|must have)"
        r"(.*?)(preferred skills|preferred qualifications|nice to have|responsibilities|responsibility|what you will do|$)",
        normalized,
        re.DOTALL
    )

    if required_match:

        required_text = required_match.group(2)

        for skill in skills:

            if skill.lower() in required_text:

                required.append(skill)

    # If no explicit required section,
    # use detected skills as required.

    if not required:

        required = skills.copy()

    return sorted(
        set(required)
    )


# =====================================================
# PREFERRED SKILLS
# =====================================================

def extract_preferred_skills(text: str):

    normalized = normalize_text(text)

    skills = extract_skills(text)

    preferred = []

    preferred_match = re.search(
        r"(preferred skills|preferred qualifications|nice to have|good to have)"
        r"(.*?)(responsibilities|responsibility|requirements|required|what you will do|$)",
        normalized,
        re.DOTALL
    )

    if preferred_match:

        preferred_text = preferred_match.group(2)

        for skill in skills:

            if skill.lower() in preferred_text:

                preferred.append(skill)

    return sorted(
        set(preferred)
    )


# =====================================================
# EXPERIENCE REQUIREMENTS
# =====================================================

def extract_experience_requirements(text: str):

    normalized = normalize_text(text)

    requirements = []

    patterns = [

        r"\d+\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience",

        r"\d+\s*-\s*\d+\s*(?:years?|yrs?)",

        r"experience\s+(?:with|in)\s+[^.]+"

    ]

    for pattern in patterns:

        matches = re.findall(
            pattern,
            normalized
        )

        requirements.extend(
            matches
        )

    return sorted(
        set(requirements)
    )


# =====================================================
# RESPONSIBILITIES
# =====================================================

def extract_responsibilities(text: str):

    normalized = normalize_text(text)

    responsibilities = []

    match = re.search(
        r"(responsibilities|responsibility|what you will do|you will)"
        r"(.*?)(requirements|required skills|required qualifications|preferred skills|preferred qualifications|nice to have|$)",
        normalized,
        re.DOTALL
    )

    if not match:
        return []

    section = match.group(2).strip()

    # Split on sentences

    sentences = re.split(
        r"[.!?]+",
        section
    )

    for sentence in sentences:

        sentence = sentence.strip()

        if len(sentence) > 15:

            responsibilities.append(
                sentence
            )

    return responsibilities[:15]


# =====================================================
# MAIN PARSER
# =====================================================

def parse_job_description(
    job_description: str
) -> JobData:

    if not job_description:

        raise ValueError(
            "Job description is empty"
        )

    text = job_description.strip()

    if not text:

        raise ValueError(
            "Job description is empty"
        )

    title = extract_job_title(
        text
    )

    required_skills = (
        extract_required_skills(
            text
        )
    )

    preferred_skills = (
        extract_preferred_skills(
            text
        )
    )

    experience_requirements = (
        extract_experience_requirements(
            text
        )
    )

    responsibilities = (
        extract_responsibilities(
            text
        )
    )

    return JobData(

        title=title,

        required_skills=required_skills,

        preferred_skills=preferred_skills,

        experience_requirements=(
            experience_requirements
        ),

        responsibilities=(
            responsibilities
        )
    )