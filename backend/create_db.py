#!/usr/bin/env python3
"""
Database creation script for Trackademic localhost version
Creates SQLite database with sample data for testing
"""

import sqlite3
from datetime import datetime, timedelta
import os

# Database file path
DB_PATH = "trackademic.db"

def create_database():
    """Create the database and all tables"""
    
    # Remove existing database if it exists
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed existing database: {DB_PATH}")
    
    # Create new database connection
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create meetings table
    cursor.execute('''
        CREATE TABLE meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            scheduled_at TIMESTAMP NOT NULL,
            duration_minutes INTEGER DEFAULT 60,
            location TEXT,
            status TEXT DEFAULT 'PENDING',
            student_id INTEGER NOT NULL,
            supervisor_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            actual_start_time TIMESTAMP,
            actual_end_time TIMESTAMP,
            actual_duration_minutes INTEGER,
            meeting_summary TEXT,
            FOREIGN KEY (student_id) REFERENCES users(id),
            FOREIGN KEY (supervisor_id) REFERENCES users(id)
        )
    ''')
    
    print("Created tables: users, meetings")
    
    # Insert sample users
    sample_users = [
        ("student@test.com", "password123", "John", "Doe", "STUDENT"),
        ("supervisor@test.com", "password123", "Dr. Jane", "Smith", "SUPERVISOR"),
        ("director@test.com", "password123", "Prof. Bob", "Wilson", "DIRECTOR"),
    ]
    
    cursor.executemany('''
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?)
    ''', sample_users)
    
    print(f"Inserted {len(sample_users)} sample users")
    
    # No sample meetings - start with empty meetings table
    print("No sample meetings inserted - starting with empty meetings table")
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print(f"Database created successfully: {DB_PATH}")

def print_database_info():
    """Print information about the created database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Print users
    print("\n=== USERS ===")
    cursor.execute("SELECT id, email, first_name, last_name, role FROM users")
    users = cursor.fetchall()
    for user in users:
        print(f"ID: {user[0]}, Email: {user[1]}, Name: {user[2]} {user[3]}, Role: {user[4]}")
    
    # Print meetings
    print("\n=== MEETINGS ===")
    cursor.execute("""
        SELECT m.id, m.title, m.scheduled_at, m.status, m.duration_minutes,
               u1.first_name || ' ' || u1.last_name as student_name,
               u2.first_name || ' ' || u2.last_name as supervisor_name
        FROM meetings m
        JOIN users u1 ON m.student_id = u1.id
        JOIN users u2 ON m.supervisor_id = u2.id
        ORDER BY m.scheduled_at
    """)
    meetings = cursor.fetchall()
    if meetings:
        for meeting in meetings:
            print(f"ID: {meeting[0]}, Title: {meeting[1]}, Scheduled: {meeting[2]}, Status: {meeting[3]}")
            print(f"    Duration: {meeting[4]}min, Student: {meeting[5]}, Supervisor: {meeting[6]}")
    else:
        print("No meetings found")
    
    conn.close()

if __name__ == "__main__":
    print("Creating Trackademic database...")
    create_database()
    print_database_info()
    print("\nDatabase setup complete!")
    print("\nLogin credentials for testing:")
    print("Student: student@test.com / password123")
    print("Supervisor: supervisor@test.com / password123")
    print("Director: director@test.com / password123")
