#!/usr/bin/env python3
"""
Seed script to create test users for local development
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine, create_tables
import models

def create_test_users():
    """Create test users for development"""
    db = SessionLocal()
    
    try:
        # Create tables if they don't exist
        create_tables()
        
        # Check if users already exist
        existing_users = db.query(models.User).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping seed.")
            return
        
        # Create test users
        test_users = [
            {
                "email": "student@test.com",
                "password": "password123",
                "first_name": "John",
                "last_name": "Student",
                "role": models.UserRole.STUDENT
            },
            {
                "email": "supervisor@test.com", 
                "password": "password123",
                "first_name": "Jane",
                "last_name": "Supervisor",
                "role": models.UserRole.SUPERVISOR
            },
            {
                "email": "director@test.com",
                "password": "password123", 
                "first_name": "Bob",
                "last_name": "Director",
                "role": models.UserRole.DIRECTOR
            }
        ]
        
        for user_data in test_users:
            user = models.User(**user_data)
            db.add(user)
            print(f"Created user: {user_data['email']} (Role: {user_data['role'].value})")
        
        db.commit()
        print("✅ Test users created successfully!")
        print("\nLogin credentials:")
        print("Student: student@test.com / password123")
        print("Supervisor: supervisor@test.com / password123")
        print("Director: director@test.com / password123")
        
    except Exception as e:
        print(f"❌ Error creating test users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables first
    models.Base.metadata.create_all(bind=engine)
    create_test_users()
