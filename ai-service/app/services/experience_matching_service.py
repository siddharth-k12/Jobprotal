from app.schemas.resume import ResumeData
from app.schemas.job import JobData
from app.services.embedding_service import create_embeddings
from app.services.similarity_service import cosine_similarity


def calculate_experience_relevance(
    resume: ResumeData,
    job: JobData
):
    if not resume.experience:
        return {
            "experience": [],
            "average_score": None
        }

    job_text = " ".join(
        [
            job.title,
            *job.required_skills,
            *job.preferred_skills,
            *job.experience_requirements,
            *job.responsibilities
        ]
    )

    experience_texts = []

    for experience in resume.experience:

        experience_text = " ".join(
            [
                experience.company,
                experience.role,
                experience.duration,
                experience.description
            ]
        )

        experience_texts.append(
            experience_text
        )

    job_vector = create_embeddings(
        [job_text]
    )[0]

    experience_vectors = create_embeddings(
        experience_texts
    )

    results = []

    for index, experience in enumerate(
        resume.experience
    ):

        score = cosine_similarity(
            job_vector,
            experience_vectors[index]
        )

        results.append({
            "company": experience.company,
            "role": experience.role,
            "score": round(score * 100, 2)
        })

    average_score = (
        sum(item["score"] for item in results)
        / len(results)
    )

    return {
        "experience": results,
        "average_score": round(
            average_score,
            2
        )
    }