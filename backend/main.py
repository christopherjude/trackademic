from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import models
import schemas
from database import get_db, create_tables
from auth import get_current_user

# Create tables on startup
create_tables()

app = FastAPI(title="Trackademic API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Trackademic API is running!"}

# User routes
@app.get("/api/users/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

# Meeting routes
@app.get("/api/meetings", response_model=List[schemas.Meeting])
def get_meetings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == models.UserRole.STUDENT:
        meetings = db.query(models.Meeting).filter(
            models.Meeting.student_id == current_user.id
        ).all()
    elif current_user.role == models.UserRole.SUPERVISOR:
        meetings = db.query(models.Meeting).filter(
            models.Meeting.supervisor_id == current_user.id
        ).all()
    else:  # Director
        meetings = db.query(models.Meeting).all()
    
    return meetings

@app.post("/api/meetings", response_model=schemas.Meeting)
def create_meeting(
    meeting: schemas.MeetingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only supervisors and directors can create meetings
    if current_user.role == models.UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Students cannot create meetings")
    
    db_meeting = models.Meeting(**meeting.dict())
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

# Meeting workflow endpoints
@app.post("/api/meetings/{meeting_id}/checkin", response_model=schemas.Meeting)
def student_checkin_meeting(
    meeting_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Student checks into a meeting"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Only the assigned student can check in
    if current_user.role != models.UserRole.STUDENT or meeting.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned student can check into this meeting")
    
    # Can only check in if meeting is scheduled
    if meeting.status != models.MeetingStatus.SCHEDULED:
        raise HTTPException(status_code=400, detail="Meeting is not in scheduled status")
    
    # Update meeting status and record actual start time
    meeting.status = models.MeetingStatus.STUDENT_CHECKED_IN
    meeting.actual_start_time = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting

@app.post("/api/meetings/{meeting_id}/confirm", response_model=schemas.Meeting)
def supervisor_confirm_meeting(
    meeting_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supervisor confirms a meeting that student has checked into"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Only the assigned supervisor can confirm
    if current_user.role not in [models.UserRole.SUPERVISOR, models.UserRole.DIRECTOR] or meeting.supervisor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned supervisor can confirm this meeting")
    
    # Can only confirm if student has checked in
    if meeting.status != models.MeetingStatus.STUDENT_CHECKED_IN:
        raise HTTPException(status_code=400, detail="Student must check in first")
    
    # Update meeting status
    meeting.status = models.MeetingStatus.CONFIRMED
    db.commit()
    db.refresh(meeting)
    return meeting

@app.post("/api/meetings/{meeting_id}/end", response_model=schemas.Meeting)
def end_meeting(
    meeting_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """End a meeting and calculate actual duration"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Either student or supervisor can end the meeting
    if not (
        (current_user.role == models.UserRole.STUDENT and meeting.student_id == current_user.id) or
        (current_user.role in [models.UserRole.SUPERVISOR, models.UserRole.DIRECTOR] and meeting.supervisor_id == current_user.id)
    ):
        raise HTTPException(status_code=403, detail="Only meeting participants can end the meeting")
    
    # Can only end if meeting is confirmed
    if meeting.status != models.MeetingStatus.CONFIRMED:
        raise HTTPException(status_code=400, detail="Meeting must be confirmed before ending")
    
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
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a meeting as missed (supervisor/director only)"""
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Only supervisor or director can mark as missed
    if current_user.role not in [models.UserRole.SUPERVISOR, models.UserRole.DIRECTOR]:
        raise HTTPException(status_code=403, detail="Only supervisors/directors can mark meetings as missed")
    
    meeting.status = models.MeetingStatus.MISSED
    db.commit()
    db.refresh(meeting)
    return meeting

# Milestone routes
@app.get("/api/milestones", response_model=List[schemas.Milestone])
def get_milestones(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == models.UserRole.STUDENT:
        milestones = db.query(models.Milestone).filter(
            models.Milestone.user_id == current_user.id
        ).all()
    else:  # Supervisor/Director can see all
        milestones = db.query(models.Milestone).all()
    
    return milestones

@app.post("/api/milestones", response_model=schemas.Milestone)
def create_milestone(
    milestone: schemas.MilestoneCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_milestone = models.Milestone(**milestone.dict())
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@app.put("/api/milestones/{milestone_id}", response_model=schemas.Milestone)
def update_milestone(
    milestone_id: int,
    milestone_update: schemas.MilestoneUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    milestone = db.query(models.Milestone).filter(models.Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    # Students can only update their own milestones
    if current_user.role == models.UserRole.STUDENT and milestone.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update fields
    for field, value in milestone_update.dict(exclude_unset=True).items():
        setattr(milestone, field, value)
        
    if milestone_update.status == models.MilestoneStatus.COMPLETED:
        milestone.completed_at = datetime.utcnow()
    
    db.commit()
    db.refresh(milestone)
    return milestone

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
