from app.services.embeddings import generate_embedding
from app.services.similarity import cosine_similarity
from app.services.ai_matching import analyze_skills


def analyze_resume_against_job(
    resume_text: str,
    job_description: str
):
    # Generate embeddings
    resume_embedding = generate_embedding(resume_text)
    job_embedding = generate_embedding(job_description)

    # Calculate semantic similarity
    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )

    # Analyze skills using LLM
    skill_analysis = analyze_skills(
        resume_text,
        job_description
    )

    return {
        "semantic_score": round(similarity * 100, 2),

        "required_skills": skill_analysis.required_skills,

        "matched_skills": skill_analysis.matched_skills,

        "missing_skills": skill_analysis.missing_skills,

        "explanation": skill_analysis.explanation,

        "recommendations": skill_analysis.recommendations
    }