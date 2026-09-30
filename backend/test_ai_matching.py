from app.services.ai_matching import analyze_skills


resume_text = """
Software developer with experience in Python, FastAPI,
PostgreSQL, Docker and React.

Built REST APIs using FastAPI and PostgreSQL.
Created Dockerized backend applications.
Developed React dashboards for internal applications.
"""


job_description = """
We are looking for a Backend Software Engineer.

Requirements:

- Strong Python programming
- Experience with FastAPI or Django
- PostgreSQL and relational databases
- Docker and containerization
- Redis
- Kubernetes
- AWS
- REST API development
"""


result = analyze_skills(
    resume_text,
    job_description
)

print("\nRequired Skills:")
print(result.required_skills)

print("\nMatched Skills:")
print(result.matched_skills)

print("\nMissing Skills:")
print(result.missing_skills)

print("\nExplanation:")
print(result.explanation)

print("\nRecommendations:")
for recommendation in result.recommendations:
    print("-", recommendation)