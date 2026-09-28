from fastapi import FastAPI

app = FastAPI(
    title="CareerForge API",
    description="AI Career Intelligence Platform",
    version="1.0.0"
)


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