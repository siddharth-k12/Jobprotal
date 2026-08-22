import io
import re

from pypdf import PdfReader


COMMON_SKILLS = [
    "javascript",
    "typescript",
    "react",
    "node.js",
    "nodejs",
    "express",
    "mongodb",
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
    "redux",
    "machine learning",
    "artificial intelligence",
    "sql",
    "pandas",
    "numpy",
    "scikit-learn",
]


def extract_text(pdf_bytes: bytes) -> str:

    try:

        reader = PdfReader(
            io.BytesIO(pdf_bytes)
        )

        pages = []

        for page in reader.pages:

            text = page.extract_text()

            if text:
                pages.append(text)

        return "\n".join(pages)

    except Exception as error:

        raise ValueError(
            f"Unable to read PDF: {error}"
        )


def clean_text(text: str) -> str:

    text = text.replace(
        "\x00",
        " "
    )

    # Normalize spaces/tabs
    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    # Normalize excessive newlines
    text = re.sub(
        r"\n{3,}",
        "\n\n",
        text
    )

    return text.strip()


def detect_sections(text: str):

    lower = text.lower()

    sections = {

        "summary": bool(
            re.search(
                r"\b(summary|profile|objective)\b",
                lower
            )
        ),

        "skills": bool(
            re.search(
                r"\b(skills|technical skills|technologies)\b",
                lower
            )
        ),

        "education": bool(
            re.search(
                r"\beducation\b",
                lower
            )
        ),

        "experience": bool(
            re.search(
                r"\b(experience|work experience|employment)\b",
                lower
            )
        ),

        "projects": bool(
            re.search(
                r"\b(projects|personal projects|academic projects)\b",
                lower
            )
        ),

        "certifications": bool(
            re.search(
                r"\b(certifications|certificates)\b",
                lower
            )
        ),
    }

    return sections


def extract_skills(text: str):

    lower = text.lower()

    found = []

    for skill in COMMON_SKILLS:

        if skill.lower() in lower:
            found.append(skill)

    return sorted(
        set(found)
    )


def calculate_section_score(sections):

    important_sections = [
        "summary",
        "skills",
        "education",
        "experience",
        "projects",
    ]

    found = sum(
        1
        for section in important_sections
        if sections.get(section)
    )

    return round(
        (found / len(important_sections)) * 100,
        2
    )


def calculate_keyword_score(
    text,
    skills
):

    if not text:
        return 0

    skill_score = min(
        len(skills) * 5,
        100
    )

    return round(
        skill_score,
        2
    )


def calculate_format_score(
    text,
    sections
):

    score = 100

    if len(text) < 500:
        score -= 30

    if not sections["skills"]:
        score -= 15

    if not sections["education"]:
        score -= 10

    if not sections["projects"]:
        score -= 10

    if not sections["experience"]:
        score -= 10

    if len(text) > 15000:
        score -= 10

    return max(
        0,
        min(score, 100)
    )


def generate_issues(
    text,
    sections,
    skills
):

    issues = []

    if not sections["summary"]:
        issues.append(
            "Resume summary or profile section is missing."
        )

    if not sections["skills"]:
        issues.append(
            "Technical skills section is missing."
        )

    if not sections["experience"]:
        issues.append(
            "Experience section is missing."
        )

    if not sections["projects"]:
        issues.append(
            "Projects section is missing."
        )

    if not sections["education"]:
        issues.append(
            "Education section is missing."
        )

    if len(text) < 500:
        issues.append(
            "Resume contains very little extractable text."
        )

    if len(skills) < 5:
        issues.append(
            "Resume contains a limited number of detectable technical skills."
        )

    return issues


def generate_suggestions(
    sections,
    skills,
    issues
):

    suggestions = []

    if not sections["summary"]:
        suggestions.append(
            "Add a concise professional summary at the top of the resume."
        )

    if not sections["skills"]:
        suggestions.append(
            "Add a dedicated Technical Skills section."
        )

    if not sections["projects"]:
        suggestions.append(
            "Add relevant projects with technologies and measurable outcomes."
        )

    if not sections["experience"]:
        suggestions.append(
            "Add relevant internship, work, or practical experience."
        )

    if len(skills) < 5:
        suggestions.append(
            "Explicitly mention the technologies and tools used in your projects."
        )

    suggestions.append(
        "Use standard section headings so ATS systems can identify resume sections."
    )

    suggestions.append(
        "Use measurable achievements instead of only describing responsibilities."
    )

    suggestions.append(
        "Keep formatting simple and avoid excessive graphics, tables, or decorative elements."
    )

    return suggestions


def calculate_final_score(
    section_score,
    keyword_score,
    format_score
):

    final_score = (
        section_score * 0.35
        + keyword_score * 0.35
        + format_score * 0.30
    )

    return round(
        final_score,
        2
    )


def analyze_resume_pdf(
    pdf_bytes: bytes
):

    # ==========================================
    # EXTRACT TEXT
    # ==========================================

    raw_text = extract_text(
        pdf_bytes
    )

    text = clean_text(
        raw_text
    )

    if not text:
        raise ValueError(
            "Could not extract text from PDF. Make sure the PDF contains selectable text."
        )

    # ==========================================
    # ANALYZE
    # ==========================================

    sections = detect_sections(
        text
    )

    skills = extract_skills(
        text
    )

    section_score = calculate_section_score(
        sections
    )

    keyword_score = calculate_keyword_score(
        text,
        skills
    )

    format_score = calculate_format_score(
        text,
        sections
    )

    final_score = calculate_final_score(
        section_score,
        keyword_score,
        format_score
    )

    issues = generate_issues(
        text,
        sections,
        skills
    )

    suggestions = generate_suggestions(
        sections,
        skills,
        issues
    )

    # ==========================================
    # RESULT
    # ==========================================

    return {

        "score": {

            "section_score": section_score,

            "keyword_score": keyword_score,

            "format_score": format_score,

            "final_score": final_score,
        },

        "skills": skills,

        "sections": sections,

        "issues": issues,

        "suggestions": suggestions,

        "text_stats": {

            "characters": len(text),

            "words": len(
                text.split()
            ),
        },
    }