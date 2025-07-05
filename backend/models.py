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

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    azure_oid = Column(String, unique=True, index=True)  # Azure AD object ID
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(Enum(UserRole))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    meetings_as_student = relationship("Meeting", foreign_keys="Meeting.student_id", back_populates="student")
    meetings_as_supervisor = relationship("Meeting", foreign_keys="Meeting.supervisor_id", back_populates="supervisor")
    milestones = relationship("Milestone", back_populates="user")

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    scheduled_at = Column(DateTime)
    duration_minutes = Column(Integer, default=60)
    location = Column(String)
    status = Column(Enum(MeetingStatus), default=MeetingStatus.PENDING)
    student_id = Column(Integer, ForeignKey("users.id"))
    supervisor_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("User", foreign_keys=[student_id], back_populates="meetings_as_student")
    supervisor = relationship("User", foreign_keys=[supervisor_id], back_populates="meetings_as_supervisor")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    due_date = Column(DateTime)
    status = Column(Enum(MilestoneStatus), default=MilestoneStatus.PENDING)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="milestones")
