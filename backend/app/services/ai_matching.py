from google import genai
from google.genai import errors
from dotenv import load_dotenv

import os

from pydantic import BaseModel, Field


# Load environment variables from .env
load_dotenv()


# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in the .env file")


# Get model from environment
# If GEMINI_MODEL is not present, use gemini-3.7-flash
GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.7-flash"
)


# Create Gemini client
client = genai.Client(
    api_key=GEMINI_API_KEY
)


class SkillAnalysis(BaseModel):
    required_skills: list[str] = Field(
        description="Technical skills explicitly or clearly required by the job description"
    )

    matched_skills: list[str] = Field(
        description="Required skills that the candidate demonstrates in the resume"
    )

    missing_skills: list[str] = Field(
        description="Required skills that are not sufficiently demonstrated in the resume"
    )

    explanation: str = Field(
        description="Short explanation of the candidate's main skill gaps"
    )

    recommendations: list[str] = Field(
        description="Practical recommendations for improving the candidate's skill gaps"
    )


def analyze_skills(
    resume_text: str,
    job_description: str
) -> SkillAnalysis:

    prompt = f"""
You are an AI career analysis system.

Analyze the candidate's resume against the job description.

Your task is to identify the technical skills required by the
job and determine which of those skills are demonstrated by
the candidate's resume.

IMPORTANT RULES:

1. Only identify skills that are relevant to the job description.
2. Do not invent requirements that are not supported by the job description.
3. A skill should be considered matched only when the resume
   provides reasonable evidence that the candidate has that skill.
4. A skill should be considered missing when it is required by
   the job but there is insufficient evidence of it in the resume.
5. Consider semantic equivalents.
   For example, experience with FastAPI can demonstrate experience
   with a Python web framework.
6. Focus primarily on technical skills.
7. Keep skill names concise and standardized.
8. Recommendations should specifically address missing skills.

CANDIDATE RESUME:

{resume_text}


JOB DESCRIPTION:

{job_description}
"""

    try:
        print(f"Using Gemini model: {GEMINI_MODEL}")

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": SkillAnalysis,
            }
        )

        if response.parsed is None:
            raise RuntimeError(
                "Gemini returned an empty or invalid response."
            )

        return response.parsed

    except errors.ServerError as e:
        print(f"Gemini server error: {e}")

        raise RuntimeError(
            "AI service is temporarily unavailable. Please try again."
        ) from e

    except errors.APIError as e:
        print(f"Gemini API error: {e}")

        raise RuntimeError(
            f"Gemini API error: {e}"
        ) from e

    except Exception as e:
        print(f"Unexpected AI matching error: {repr(e)}")

        raise RuntimeError(
            "An unexpected error occurred while analyzing the resume."
        ) from e