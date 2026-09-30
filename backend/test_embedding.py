from app.services.embeddings import generate_embedding
from app.services.similarity import cosine_similarity


resume_text = """
Python developer with experience building REST APIs
using FastAPI and PostgreSQL. Built backend services,
Docker containers and authentication systems.
"""

job_description = """
We are looking for a backend software engineer who has
experience developing Python web applications, RESTful
services, relational databases and containerized systems.
Experience with FastAPI and PostgreSQL is preferred.
"""

resume_embedding = generate_embedding(resume_text)
job_embedding = generate_embedding(job_description)

similarity = cosine_similarity(
    resume_embedding,
    job_embedding
)

print("Resume embedding dimensions:", len(resume_embedding))
print("Job embedding dimensions:", len(job_embedding))
print("Cosine similarity:", similarity)
print("Semantic match score:", round(similarity * 100, 2), "%")