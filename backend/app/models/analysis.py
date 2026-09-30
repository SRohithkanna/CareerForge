from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    resume_id: Mapped[int] = mapped_column(
        ForeignKey("resumes.id"),
        nullable=False,
        index=True
    )

    job_id: Mapped[int] = mapped_column(
        ForeignKey("jobs.id"),
        nullable=False,
        index=True
    )

    semantic_score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    required_skills: Mapped[list] = mapped_column(
        JSON,
        nullable=False
    )

    matched_skills: Mapped[list] = mapped_column(
        JSON,
        nullable=False
    )

    missing_skills: Mapped[list] = mapped_column(
        JSON,
        nullable=False
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    recommendations: Mapped[list] = mapped_column(
        JSON,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )