import io
import re

from pypdf import PdfReader

from app.schemas.resume import (
    ResumeData,
    Experience,
    Project
)


# =====================================================
# COMMON SKILLS
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
    "mongoose",
    "mysql",
    "postgresql",
    "python",
    "java",
    "c++",
    "fastapi",
    "docker",
    "git",
    "github",
    "aws",
    "redis",
    "rest api",
    "rest",
    "html",
    "css",
    "tailwind",
    "tailwind css",
    "redux",
    "redux toolkit",
    "machine learning",
    "artificial intelligence",
    "sql",
    "pandas",
    "numpy",
    "scikit-learn",
    "next.js",
    "nextjs",
    "graphql",
    "socket.io",
    "jwt",
    "cloudinary"
]


# =====================================================
# PDF TEXT EXTRACTION
# =====================================================

def extract_text_from_pdf(pdf_bytes: bytes) -> str:

    reader = PdfReader(
        io.BytesIO(pdf_bytes)
    )

    pages = []

    for page in reader.pages:

        text = page.extract_text()

        if text:
            pages.append(text)

    return "\n".join(pages)


# =====================================================
# TEXT CLEANING
# =====================================================

def clean_text(text: str) -> str:

    text = text.replace(
        "\x00",
        " "
    )

    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    return text.strip()


# =====================================================
# SECTION EXTRACTION
# =====================================================

def extract_section(
    text: str,
    section_names: list[str]
) -> str:

    pattern = (
        r"(?im)^("
        + "|".join(
            re.escape(name)
            for name in section_names
        )
        + r")\s*:?\s*$"
    )

    matches = list(
        re.finditer(
            pattern,
            text
        )
    )

    if not matches:
        return ""

    start = matches[0].end()

    next_match = None

    for match in matches[1:]:

        if match.start() > start:
            next_match = match
            break

    end = (
        next_match.start()
        if next_match
        else len(text)
    )

    return text[start:end].strip()


# =====================================================
# NAME
# =====================================================

def extract_name(text: str) -> str:

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    if not lines:
        return "Unknown"

    # Usually candidate name is near the top.
    for line in lines[:8]:

        lower = line.lower()

        if any(
            keyword in lower
            for keyword in [
                "resume",
                "curriculum vitae",
                "cv",
                "@",
                "phone",
                "mobile",
                "linkedin",
                "github"
            ]
        ):
            continue

        if len(line.split()) <= 6:
            return line

    return "Unknown"


# =====================================================
# SUMMARY
# =====================================================

def extract_summary(text: str) -> str:

    summary = extract_section(
        text,
        [
            "summary",
            "professional summary",
            "profile",
            "professional profile",
            "objective",
            "career objective"
        ]
    )

    return summary


# =====================================================
# SKILLS
# =====================================================

def extract_skills(
    text: str
) -> list[str]:

    lower_text = text.lower()

    found = []

    for skill in COMMON_SKILLS:

        if skill.lower() in lower_text:

            found.append(skill)

    # Remove duplicates
    return sorted(
        set(found)
    )


# =====================================================
# EDUCATION
# =====================================================

def extract_education(
    text: str
) -> list[str]:

    education_text = extract_section(
        text,
        [
            "education",
            "academic background",
            "educational background"
        ]
    )

    if not education_text:
        return []

    lines = []

    for line in education_text.splitlines():

        line = line.strip()

        if line:
            lines.append(line)

    return lines


# =====================================================
# EXPERIENCE
# =====================================================

def extract_experience(
    text: str
) -> list[Experience]:

    experience_text = extract_section(
        text,
        [
            "experience",
            "work experience",
            "professional experience",
            "employment",
            "internship",
            "work history"
        ]
    )

    if not experience_text:
        return []

    lines = [
        line.strip()
        for line in experience_text.splitlines()
        if line.strip()
    ]

    # Simple parser.
    #
    # We keep the extracted information rather than
    # guessing company/role details aggressively.

    experiences = []

    current_lines = []

    for line in lines:

        if re.search(
            r"\b(20\d{2}|19\d{2})\b",
            line
        ) and current_lines:

            block = "\n".join(
                current_lines
            )

            experiences.append(
                build_experience(
                    block
                )
            )

            current_lines = []

        current_lines.append(line)

    if current_lines:

        block = "\n".join(
            current_lines
        )

        experiences.append(
            build_experience(
                block
            )
        )

    return experiences


def build_experience(
    block: str
) -> Experience:

    lines = [
        line.strip()
        for line in block.splitlines()
        if line.strip()
    ]

    if not lines:

        return Experience(
            company="Unknown",
            role="Unknown",
            duration="",
            description=""
        )

    role = lines[0]

    company = (
        lines[1]
        if len(lines) > 1
        else "Unknown"
    )

    duration = ""

    for line in lines:

        if re.search(
            r"\b(19|20)\d{2}\b",
            line
        ):

            duration = line
            break

    description_lines = []

    for line in lines[2:]:

        if line != duration:
            description_lines.append(line)

    description = " ".join(
        description_lines
    )

    return Experience(
        company=company,
        role=role,
        duration=duration,
        description=description
    )


# =====================================================
# PROJECTS
# =====================================================

def extract_projects(
    text: str
) -> list[Project]:

    projects_text = extract_section(
        text,
        [
            "projects",
            "personal projects",
            "academic projects",
            "project experience"
        ]
    )

    if not projects_text:
        return []

    lines = [
        line.strip()
        for line in projects_text.splitlines()
        if line.strip()
    ]

    projects = []

    current_name = None
    current_lines = []

    for line in lines:

        # Detect a new project.
        if (
            current_name is None
            and len(line.split()) <= 12
        ):

            current_name = line
            continue

        if (
            current_name is not None
            and re.search(
                r"\b(technologies|tech stack|stack)\b",
                line,
                re.IGNORECASE
            )
        ):

            current_lines.append(line)
            continue

        if (
            current_name is not None
            and line.endswith(":")
        ):

            projects.append(
                build_project(
                    current_name,
                    current_lines
                )
            )

            current_name = line.rstrip(":")
            current_lines = []

            continue

        current_lines.append(line)

    if current_name:

        projects.append(
            build_project(
                current_name,
                current_lines
            )
        )

    return projects


def build_project(
    name: str,
    lines: list[str]
) -> Project:

    combined_text = " ".join(lines)

    technologies = []

    lower_text = combined_text.lower()

    for skill in COMMON_SKILLS:

        if skill.lower() in lower_text:

            technologies.append(skill)

    technologies = sorted(
        set(technologies)
    )

    description = combined_text

    return Project(
        name=name,
        technologies=technologies,
        description=description
    )


# =====================================================
# MAIN PARSER
# =====================================================

def parse_resume_pdf(
    pdf_bytes: bytes
) -> ResumeData:

    if not pdf_bytes:

        raise ValueError(
            "Resume PDF is empty"
        )

    raw_text = extract_text_from_pdf(
        pdf_bytes
    )

    text = clean_text(
        raw_text
    )

    if not text:

        raise ValueError(
            "Could not extract text from resume PDF"
        )

    return ResumeData(

        name=extract_name(
            text
        ),

        summary=extract_summary(
            text
        ),

        skills=extract_skills(
            text
        ),

        experience=extract_experience(
            text
        ),

        education=extract_education(
            text
        ),

        projects=extract_projects(
            text
        ),

        certifications=extract_certifications(
            text
        )
    )


# =====================================================
# CERTIFICATIONS
# =====================================================

def extract_certifications(
    text: str
) -> list[str]:

    certification_text = extract_section(
        text,
        [
            "certifications",
            "certificates",
            "certification"
        ]
    )

    if not certification_text:
        return []

    return [
        line.strip()
        for line in certification_text.splitlines()
        if line.strip()
    ]