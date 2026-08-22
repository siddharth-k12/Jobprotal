from app.schemas.resume import ResumeData
from app.schemas.job import JobData
from app.services.embedding_service import create_embeddings
from app.services.similarity_service import cosine_similarity


def calculate_project_relevance(
    resume: ResumeData,
    job: JobData
):
    if not resume.projects:
        return {
            "projects": [],
            "average_score": 0.0
        }

    job_text = " ".join(
        [
            job.title,
            *job.required_skills,
            *job.preferred_skills,
            *job.responsibilities
        ]
    )

    project_texts = []

    for project in resume.projects:

        project_text = " ".join(
            [
                project.name,
                *project.technologies,
                project.description
            ]
        )

        project_texts.append(project_text)

    job_vector = create_embeddings(
        [job_text]
    )[0]

    project_vectors = create_embeddings(
        project_texts
    )

    results = []

    for index, project in enumerate(
        resume.projects
    ):

        score = cosine_similarity(
            job_vector,
            project_vectors[index]
        )

        results.append({
            "project": project.name,
            "score": round(score * 100, 2)
        })

    average_score = (
        sum(item["score"] for item in results)
        / len(results)
    )

    return {
        "projects": results,
        "average_score": round(
            average_score,
            2
        )
    }