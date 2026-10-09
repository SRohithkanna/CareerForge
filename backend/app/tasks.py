
from app.core.celery_app import celery_app
from app.database.connection import SessionLocal
from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis
from app.services.career_analysis import analyze_resume_against_job


@celery_app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=5
)
def analyze_resume_job_task(
    self,
    user_id: int,
    resume_id: int,
    job_id: int,
    analysis_id: int
):
    db = SessionLocal()

    try:
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == user_id
        ).first()

        analysis = db.query(Analysis).filter(
            Analysis.id == analysis_id,
            Analysis.user_id == user_id
        ).first()

        if not resume or not job or not analysis:
            raise ValueError("Resume, job, or analysis not found")

        try:
            result = analyze_resume_against_job(
                resume.extracted_text,
                job.description
            )

            analysis.status = "completed"
            analysis.semantic_score = result["semantic_score"]
            analysis.required_skills = result["required_skills"]
            analysis.matched_skills = result["matched_skills"]
            analysis.missing_skills = result["missing_skills"]
            analysis.explanation = result["explanation"]
            analysis.recommendations = result["recommendations"]

            db.commit()

            return {
                "analysis_id": analysis.id,
                "status": "completed"
            }

        except Exception as error:
            from google.genai import errors

            if isinstance(error, errors.ServerError):
                db.rollback()

                if self.request.retries < self.max_retries:
                    raise self.retry(
                        exc=error,
                        countdown=5 * (2 ** self.request.retries)
                    )

                analysis.status = "failed"
                db.commit()
                return {
                    "analysis_id": analysis.id,
                    "status": "failed"
                }

            analysis.status = "failed"
            db.commit()
            raise

    finally:
        db.close()
        