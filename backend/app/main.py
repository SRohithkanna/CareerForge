from fastapi import FastAPI

from app.database.base import Base
from app.database.connection import engine
from app.models import User

app = FastAPI(
    title="CareerForge API",
    description="AI Career Intelligence Platform",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)


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