from fastapi import FastAPI

from app.routes.ats import router as ats_router
from app.routes.resume import router as resume_router
from app.routes.job import router as job_router
from app.routes.matching import router as matching_router
from app.routes.embedding import router as embedding_router
from app.routes.semantic import router as semantic_router


app = FastAPI(
    title="Job Portal AI Service",
    version="1.0.0"
)


app.include_router(ats_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(matching_router)
app.include_router(embedding_router)
app.include_router(semantic_router)


@app.get("/")
def home():

    return {
        "message": "Job Portal AI Service is running"
    }


@app.get("/health")
def health_check():

    return {
        "status": "ok"
    }