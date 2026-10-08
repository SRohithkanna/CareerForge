from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON,String, Text
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
    status: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    default="processing"
    )
    semantic_score: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    required_skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    matched_skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    missing_skills: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    explanation: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    recommendations: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )