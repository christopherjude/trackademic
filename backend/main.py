from fastapi import FastAPI, Depends, HTTPException, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import schemas
from database import get_db, create_tables
from auth import authenticate_user

# Create tables on startup
create_tables()

app = FastAPI(title="Trackademic API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",  # Alternative dev port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Trackademic API is running locally!"}


# Authentication routes
@app.post("/api/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user with plain text password
    db_user = models.User(
        email=user.email,
        password=user.password,  # Simple plain text password
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/auth/login", response_model=schemas.User)
def login_user(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login user and return user info"""
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    return user

# User routes
@app.get("/api/users/me")
def get_current_user_info(user_id: int = Query(...), db: Session = Depends(get_db)):
    """Get user information by ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/users/students", response_model=List[schemas.User])
def get_students(db: Session = Depends(get_db)):
    """Get list of all students"""
    students = db.query(models.User).filter(models.User.role == models.UserRole.STUDENT).all()
    return students


# Meeting routes
@app.get("/api/meetings", response_model=List[schemas.Meeting])
def get_meetings(db: Session = Depends(get_db)):
    """Get all meetings - simplified for localhost"""
    meetings = db.query(models.Meeting).all()
    return meetings


@app.post("/api/meetings", response_model=schemas.Meeting)
def create_meeting(
    meeting: schemas.MeetingCreate,
    db: Session = Depends(get_db)
):
    """Create a new meeting"""
    db_meeting = models.Meeting(**meeting.dict())
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting


# Meeting workflow endpoints
@app.post("/api/meetings/{meeting_id}/checkin", response_model=schemas.Meeting)
def student_checkin_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """Student checks into a meeting - simplified for localhost"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Update meeting status and record actual start time
    meeting.status = models.MeetingStatus.CONFIRMED  # Simplified status
    meeting.actual_start_time = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting


@app.post("/api/meetings/{meeting_id}/confirm", response_model=schemas.Meeting)
def supervisor_confirm_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """Confirm a meeting - simplified for localhost"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Update meeting status
    meeting.status = models.MeetingStatus.CONFIRMED
    db.commit()
    db.refresh(meeting)
    return meeting


@app.post("/api/meetings/{meeting_id}/end", response_model=schemas.Meeting)
def end_meeting(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """End a meeting and calculate actual duration - simplified for localhost"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    # Calculate actual duration
    end_time = datetime.utcnow()
    if meeting.actual_start_time:
        duration = end_time - meeting.actual_start_time
        actual_duration_minutes = int(duration.total_seconds() / 60)
    else:
        actual_duration_minutes = 0

    # Update meeting
    meeting.status = models.MeetingStatus.COMPLETED
    meeting.actual_end_time = end_time
    meeting.actual_duration_minutes = actual_duration_minutes
    db.commit()
    db.refresh(meeting)
    return meeting


@app.post("/api/meetings/{meeting_id}/mark-missed", response_model=schemas.Meeting)
def mark_meeting_missed(
    meeting_id: int,
    db: Session = Depends(get_db)
):
    """Mark a meeting as missed - simplified for localhost"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    meeting.status = models.MeetingStatus.MISSED
    db.commit()
    db.refresh(meeting)
    return meeting


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
