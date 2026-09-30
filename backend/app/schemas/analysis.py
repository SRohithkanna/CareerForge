from datetime import datetime

from pydantic import BaseModel


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_id: int
    semantic_score: float
    required_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    explanation: str
    recommendations: list[str]
    created_at: datetime

    class Config:
        from_attributes = True