#!/usr/bin/env python3
"""
Script to create and populate the database with sample data
"""
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base, User, Meeting, UserRole, MeetingStatus
from datetime import datetime

# Create all tables
Base.metadata.create_all(bind=engine)

# Create a database session
db = Session(bind=engine)

try:
    # Clear existing data
    db.query(Meeting).delete()
    db.query(User).delete()
    
    # Create users
    alice = User(
        azure_oid="alice-azure-oid-123",
        email="alice@trackademic.uk",
        first_name="Alice",
        last_name="Studyalot",
        role=UserRole.STUDENT
    )
    
    bob = User(
        azure_oid="bob-azure-oid-456", 
        email="bob@trackademic.uk",
        first_name="Bob",
        last_name="Teachalot",
        role=UserRole.SUPERVISOR
    )
    
    candice = User(
        azure_oid="candice-azure-oid-789",
        email="candice@trackademic.uk", 
        first_name="Candice",
        last_name="Adminalot",
        role=UserRole.DIRECTOR
    )
    
    db.add_all([alice, bob, candice])
    db.commit()
    
    # Create meetings between Alice and Bob
    meetings = [
        Meeting(
            title="Project Kickoff Meeting",
            description="Initial project discussion",
            scheduled_at=datetime(2025, 6, 15, 11, 0),
            duration_minutes=60,
            status=MeetingStatus.COMPLETED,
            student_id=alice.id,
            supervisor_id=bob.id,
            actual_start_time=datetime(2025, 6, 15, 11, 5),
            actual_end_time=datetime(2025, 6, 15, 12, 10),
            actual_duration_minutes=65
        ),
        Meeting(
            title="Literature Review Discussion", 
            description="Discuss progress on literature review",
            scheduled_at=datetime(2025, 6, 28, 15, 30),
            duration_minutes=45,
            status=MeetingStatus.COMPLETED,
            student_id=alice.id,
            supervisor_id=bob.id,
            actual_start_time=datetime(2025, 6, 28, 15, 32),
            actual_end_time=datetime(2025, 6, 28, 16, 15),
            actual_duration_minutes=43
        ),
        Meeting(
            title="Mid-Progress Review",
            description="Review progress halfway through the project",
            scheduled_at=datetime(2025, 7, 5, 14, 0),
            duration_minutes=60,
            status=MeetingStatus.SCHEDULED,
            student_id=alice.id,
            supervisor_id=bob.id
        ),
        Meeting(
            title="Weekly Check-in",
            description="Regular weekly progress check",
            scheduled_at=datetime(2025, 7, 8, 14, 0),
            duration_minutes=30,
            status=MeetingStatus.SCHEDULED,
            student_id=alice.id,
            supervisor_id=bob.id
        ),
        Meeting(
            title="Methodology Review",
            description="Review research methodology",
            scheduled_at=datetime(2025, 7, 12, 10, 0),
            duration_minutes=60,
            status=MeetingStatus.SCHEDULED,
            student_id=alice.id,
            supervisor_id=bob.id
        ),
        Meeting(
            title="Thesis Draft Review",
            description="Review first draft of thesis",
            scheduled_at=datetime(2025, 7, 19, 15, 0),
            duration_minutes=90,
            status=MeetingStatus.SCHEDULED,
            student_id=alice.id,
            supervisor_id=bob.id
        )
    ]
    
    db.add_all(meetings)
    db.commit()
    
    print("Database created and populated successfully!")
    print(f"Created {len([alice, bob, candice])} users")
    print(f"Created {len(meetings)} meetings")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
