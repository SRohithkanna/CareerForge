from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.resume import Resume
from app.models.job import Job
from app.models.user import User
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisResponse
from app.tasks import analyze_resume_job_task

router = APIRouter(
    prefix="/api/matching",
    tags=["Matching"]
)


@router.post(
    "/{resume_id}/{job_id}",
    response_model=AnalysisResponse,
    status_code=202
)
def analyze_resume_job(
    resume_id: int,
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Check if resume belongs to current user
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Check if job belongs to current user
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Check if an analysis already exists
    existing_analysis = db.query(Analysis).filter(
        Analysis.user_id == current_user.id,
        Analysis.resume_id == resume.id,
        Analysis.job_id == job.id,
        Analysis.status.in_(["processing", "completed"])
    ).order_by(
        Analysis.created_at.desc()
    ).first()

    # If analysis already exists, return it
    if existing_analysis:
        return existing_analysis

    # Create a new analysis
    analysis = Analysis(
        user_id=current_user.id,
        resume_id=resume.id,
        job_id=job.id,
        status="processing"
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Send AI analysis to Celery
    analyze_resume_job_task.delay(
        current_user.id,
        resume.id,
        job.id,
        analysis.id
    )

    return analysis