from datetime import datetime

from pydantic import BaseModel


class ResumeResponse(BaseModel):
    id: int
    file_name: str
    extracted_text: str
    created_at: datetime

    class Config:
        from_attributes = True