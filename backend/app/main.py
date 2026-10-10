from fastapi import FastAPI

from app.database.base import Base
from app.database.connection import engine
from app.models import User
from app.api.auth import router as auth_router
from app.api.resumes import router as resume_router
from app.api.jobs import router as job_router
from app.api.matching import router as matching_router
from app.api.analyses import router as analyses_router

app = FastAPI(
    title="CareerForge API",
    description="AI Career Intelligence Platform",
    version="1.0.0"
)


app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(matching_router)
app.include_router(analyses_router)

@app.get("/")
def home():
    return {"message": "Welcome to CareerForge"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/info")
def api_info():
    return {
        "name": "CareerForge",
        "version": "1.0.0",
        "description": "AI Career Intelligence Platform"
    }


@app.get("/db-test")
def database_test():
    try:
        with engine.connect():
            return {"database": "connected"}
    except Exception as e:
        return {
            "database": "connection failed",
            "error": str(e)
        }