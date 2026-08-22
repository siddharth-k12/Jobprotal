from fastapi import APIRouter

from app.schemas.job import JobRequest, JobData
from app.services.job_service import extract_job_data


router = APIRouter(
    prefix="/job",
    tags=["Job"]
)


@router.post("/parse", response_model=JobData)
def parse_job(data: JobRequest):

    return extract_job_data(
        data.job_description
    )