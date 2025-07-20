from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    STUDENT = "student"
    SUPERVISOR = "supervisor" 
    DIRECTOR = "director"

class MilestoneStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class MeetingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    MISSED = "missed"
    CANCELLED = "cancelled"
    SCHEDULED = "scheduled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    azure_oid = Column(String(255), unique=True, index=True, nullable=False)  # Azure AD object ID
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    meetings_as_student = relationship("Meeting", foreign_keys="Meeting.student_id", back_populates="student")
    meetings_as_supervisor = relationship("Meeting", foreign_keys="Meeting.supervisor_id", back_populates="supervisor")
    milestones = relationship("Milestone", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=60, nullable=True)
    location = Column(String(255), nullable=True)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.PENDING, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    supervisor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    student = relationship("User", foreign_keys=[student_id], back_populates="meetings_as_student")
    supervisor = relationship("User", foreign_keys=[supervisor_id], back_populates="meetings_as_supervisor")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(Enum(MilestoneStatus), default=MilestoneStatus.PENDING, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="milestones")
