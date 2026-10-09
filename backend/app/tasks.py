from app.core.celery_app import celery_app
from app.database.connection import SessionLocal
from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis
from app.services.career_analysis import analyze_resume_against_job


@celery_app.task(
    bind=True,
    autoretry_for=(RuntimeError,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3}
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

        if not resume:
            raise ValueError("Resume not found")

        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == user_id
        ).first()

        if not job:
            raise ValueError("Job not found")

        analysis = db.query(Analysis).filter(
            Analysis.id == analysis_id,
            Analysis.user_id == user_id
        ).first()

        if not analysis:
            raise ValueError("Analysis not found")

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

        except RuntimeError:
            # Let Celery automatically retry
            raise

        except Exception:
            analysis.status = "failed"
            db.commit()
            raise

    finally:
        db.close()