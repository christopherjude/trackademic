import azure.functions as func
import json
import sys
import os
import logging

# Add the api directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Handle CORS preflight
        if req.method == 'OPTIONS':
            return func.HttpResponse(
                status_code=200,
                headers={
                    'Access-Control-Allow-Origin': 'https://trackademic.uk',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )

        # Try to import database modules
        try:
            from auth import decode_token
            from database import get_db, create_tables
            import models
        except Exception as import_error:
            logging.error(f"Import error: {import_error}")
            return func.HttpResponse(
                json.dumps({
                    "error": "Database configuration error",
                    "details": str(import_error),
                    "fallback": "Check /api/dbtest for diagnostics"
                }),
                status_code=500,
                headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            )

        # Initialize database tables
        try:
            create_tables()
        except Exception as table_error:
            logging.error(f"Table creation error: {table_error}")

        # Get authorization header - required for production
        auth_header = req.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return func.HttpResponse(
                json.dumps({"error": "Missing or invalid authorization header"}),
                status_code=401,
                headers={
                    'Content-Type': 'application/json', 
                    'Access-Control-Allow-Origin': 'https://trackademic.uk',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )

        # Extract token and decode
        token = auth_header.split(' ')[1]
        user_payload = decode_token(token)
        
        # Get database session
        db = next(get_db())
        
        # Get or create user
        user = db.query(models.User).filter(models.User.azure_oid == user_payload["oid"]).first()
        if not user:
            user = models.User(
                azure_oid=user_payload["oid"],
                email=user_payload.get("email", "unknown@email.com"),
                first_name=user_payload.get("given_name", "Unknown"),
                last_name=user_payload.get("family_name", "User"),
                role=models.UserRole.STUDENT
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        if req.method == 'GET':
            # Get meetings for authenticated user
            meetings = db.query(models.Meeting).filter(
                (models.Meeting.student_id == user.id) | 
                (models.Meeting.supervisor_id == user.id)
            ).all()
            
            meetings_data = []
            for meeting in meetings:
                meetings_data.append({
                    "id": meeting.id,
                    "title": meeting.title,
                    "description": meeting.description,
                    "scheduled_time": meeting.scheduled_at.isoformat() if meeting.scheduled_at else None,
                    "status": meeting.status.value,
                    "student_id": meeting.student_id,
                    "supervisor_id": meeting.supervisor_id
                })
            
            db.close()
            
            return func.HttpResponse(
                json.dumps(meetings_data),
                status_code=200,
                headers={
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://trackademic.uk',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )

        elif req.method == 'POST':
            # Create new meeting
            req_json = req.get_json()
            
            new_meeting = models.Meeting(
                title=req_json.get('title', 'New Meeting'),
                description=req_json.get('description', ''),
                scheduled_at=req_json.get('scheduled_time'),
                student_id=user.id,
                status=models.MeetingStatus.SCHEDULED
            )
            db.add(new_meeting)
            db.commit()
            db.refresh(new_meeting)
            db.close()
            
            return func.HttpResponse(
                json.dumps({
                    "id": new_meeting.id,
                    "title": new_meeting.title,
                    "message": "Meeting created successfully"
                }),
                status_code=201,
                headers={
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'https://trackademic.uk',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )
        
        else:
            return func.HttpResponse(
                json.dumps({"error": "Method not allowed"}),
                status_code=405,
                headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            )
    
    except Exception as e:
        logging.error(f"General error in meetings endpoint: {e}")
        return func.HttpResponse(
            json.dumps({
                "error": "Internal server error",
                "details": str(e),
                "suggestion": "Check /api/dbtest for database diagnostics"
            }),
            status_code=500,
            headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        )
