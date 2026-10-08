from datetime import datetime
from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    status: str

    semantic_score: float | None
    required_skills: list[str] | None
    matched_skills: list[str] | None
    missing_skills: list[str] | None
    explanation: str | None
    recommendations: list[str] | None

    created_at: datetime

    class Config:
        from_attributes = True