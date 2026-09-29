import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeResponse


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    contents = await file.read()

    temp_file = f"temp_{current_user.id}_{file.filename}"

    try:
        with open(temp_file, "wb") as f:
            f.write(contents)

        reader = PdfReader(temp_file)

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

    resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        extracted_text=extracted_text
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume