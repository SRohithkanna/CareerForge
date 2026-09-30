
#Convert Python developer with experience building REST APIs using FastAPI and PostgreSQL.
#to [ 0.013,-0.284,0.721, 0.092, ...] embedding vector
from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_embedding(text: str) -> list[float]:
    result = client.models.embed_content(
        model="gemini-embedding-2",
        contents=text
    )

    return result.embeddings[0].values