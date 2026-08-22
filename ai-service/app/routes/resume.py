from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.pdf_service import extract_text_from_pdf
from app.services.resume_service import extract_resume_data
from app.schemas.resume import ResumeData


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/extract")
async def extract_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_bytes = await file.read()

    text = extract_text_from_pdf(file_bytes)

    if not text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    return {
        "filename": file.filename,
        "text": text
    }


@router.post("/parse", response_model=ResumeData)
async def parse_resume(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_bytes = await file.read()

    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )

    resume_data = extract_resume_data(resume_text)

    return resume_data