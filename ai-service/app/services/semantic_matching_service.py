from app.services.embedding_service import create_embeddings
from app.services.similarity_service import cosine_similarity


def semantic_match_skills(
    resume_skills: list[str],
    job_skills: list[str],
    threshold: float = 0.80
):
    if not resume_skills or not job_skills:
        return {
            "matches": [],
            "unmatched": job_skills
        }

    resume_vectors = create_embeddings(resume_skills)
    job_vectors = create_embeddings(job_skills)

    candidates = []

    for job_index, job_skill in enumerate(job_skills):

        for resume_index, resume_skill in enumerate(
            resume_skills
        ):

            score = cosine_similarity(
                job_vectors[job_index],
                resume_vectors[resume_index]
            )

            candidates.append({
                "job_index": job_index,
                "resume_index": resume_index,
                "job_skill": job_skill,
                "resume_skill": resume_skill,
                "similarity": score
            })

    candidates.sort(
        key=lambda item: item["similarity"],
        reverse=True
    )

    used_resume_indexes = set()
    used_job_indexes = set()

    matches = []

    for candidate in candidates:

        if candidate["similarity"] < threshold:
            continue

        if candidate["resume_index"] in used_resume_indexes:
            continue

        if candidate["job_index"] in used_job_indexes:
            continue

        matches.append({
            "job_skill": candidate["job_skill"],
            "resume_skill": candidate["resume_skill"],
            "similarity": round(
                candidate["similarity"],
                4
            )
        })

        used_resume_indexes.add(
            candidate["resume_index"]
        )

        used_job_indexes.add(
            candidate["job_index"]
        )

    unmatched = [
        skill
        for index, skill in enumerate(job_skills)
        if index not in used_job_indexes
    ]

    return {
        "matches": matches,
        "unmatched": unmatched
    }