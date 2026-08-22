from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.ats_analyzer import analyze_resume_pdf


router = APIRouter(
    prefix="/ats",
    tags=["ATS"]
)


@router.post("/analyze-pdf")
async def analyze_resume(
    file: UploadFile = File(...)
):

    # Check extension
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    # Check MIME type when available
    if (
        file.content_type
        and file.content_type != "application/pdf"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    # Read file
    pdf_bytes = await file.read()

    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded PDF is empty"
        )

    # 10 MB limit
    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="PDF must be smaller than 10 MB"
        )

    # Verify actual PDF signature
    if not pdf_bytes.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file"
        )

    try:

        result = analyze_resume_pdf(
            pdf_bytes
        )

        return {
            "success": True,
            "data": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        print(
            "ATS analyzer error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze resume"
        )