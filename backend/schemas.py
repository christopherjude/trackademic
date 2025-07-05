from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from models import UserRole, MilestoneStatus, MeetingStatus

# User schemas
class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    role: UserRole

class UserCreate(UserBase):
    azure_oid: str

class User(UserBase):
    id: int
    azure_oid: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Meeting schemas
class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int = 60
    location: Optional[str] = None

class MeetingCreate(MeetingBase):
    student_id: int
    supervisor_id: int
    status: Optional[MeetingStatus] = MeetingStatus.PENDING

class Meeting(MeetingBase):
    id: int
    status: MeetingStatus
    student_id: int
    supervisor_id: int
    created_at: datetime
    student: User
    supervisor: User
    
    class Config:
        from_attributes = True

# Milestone schemas
class MilestoneBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: datetime

class MilestoneCreate(MilestoneBase):
    user_id: int

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[MilestoneStatus] = None

class Milestone(MilestoneBase):
    id: int
    status: MilestoneStatus
    user_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
