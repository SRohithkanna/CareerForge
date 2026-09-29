from datetime import datetime

from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    company: str
    description: str


class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True