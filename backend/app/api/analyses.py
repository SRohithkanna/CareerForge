from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.schemas.analysis import AnalysisResponse


router = APIRouter(
    prefix="/api/analyses",
    tags=["Analyses"]
)


@router.get("/", response_model=list[AnalysisResponse])
def get_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(
        Analysis.user_id == current_user.id
    ).order_by(
        Analysis.created_at.desc()
    ).all()

    return analyses


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return analysis