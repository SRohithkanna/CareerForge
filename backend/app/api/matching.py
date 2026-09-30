from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.resume import Resume
from app.models.job import Job
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse
from app.services.career_analysis import analyze_resume_against_job


router = APIRouter(
    prefix="/api/matching",
    tags=["Matching"]
)


@router.post(
    "/{resume_id}/{job_id}",
    response_model=AnalysisResponse
)
def analyze_resume_job(
    resume_id: int,
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the resume belonging to the current user
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Find the job belonging to the current user
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Run AI analysis
    try:
        result = analyze_resume_against_job(
            resume.extracted_text,
            job.description
        )

    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )

    # Save the AI analysis in PostgreSQL
    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=job.id,
        semantic_score=result["semantic_score"],
        required_skills=result["required_skills"],
        matched_skills=result["matched_skills"],
        missing_skills=result["missing_skills"],
        explanation=result["explanation"],
        recommendations=result["recommendations"]
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis