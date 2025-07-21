from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from models import UserRole, MeetingStatus

# User schemas
class UserBase(BaseModel):
    email: str
    first_name: str
    last_name: str
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Meeting schemas
class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    duration_minutes: int = 60
    location: Optional[str] = None
    status: MeetingStatus = MeetingStatus.SCHEDULED

class MeetingCreate(MeetingBase):
    student_id: int
    supervisor_id: int
    status: Optional[MeetingStatus] = MeetingStatus.PENDING

class Meeting(MeetingBase):
    id: int
    status: MeetingStatus
    student_id: int
    supervisor_id: int
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    actual_duration_minutes: Optional[int] = None
    created_at: datetime
    student: User
    supervisor: User
    
    class Config:
        from_attributes = True

class MeetingCheckIn(BaseModel):
    """Schema for student checking into a meeting"""
    pass

class MeetingConfirm(BaseModel):
    """Schema for supervisor confirming a meeting"""
    pass

class MeetingEnd(BaseModel):
    """Schema for ending a meeting"""
    pass
