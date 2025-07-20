import azure.functions as func
import json
import sys
import os

# Add the api directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')

from auth import decode_token
from database import get_db
import models

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

        # Get authorization header
        auth_header = req.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return func.HttpResponse(
                json.dumps({"detail": "Missing or invalid authorization header"}),
                status_code=401,
                headers={'Content-Type': 'application/json'}
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
                email=user_payload["email"],
                first_name=user_payload["given_name"],
                last_name=user_payload["family_name"],
                role=models.UserRole.STUDENT
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        if req.method == 'GET':
            # Get meetings for user
            meetings = db.query(models.Meeting).filter(
                (models.Meeting.student_id == user.id) | 
                (models.Meeting.supervisor_id == user.id)
            ).all()
            
            meetings_data = []
            for meeting in meetings:
                meetings_data.append({
                    "id": meeting.id,
                    "title": meeting.title,
                    "scheduled_time": meeting.scheduled_time.isoformat() if meeting.scheduled_time else None,
                    "status": meeting.status.value,
                    "student_id": meeting.student_id,
                    "supervisor_id": meeting.supervisor_id
                })
            
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
            try:
                req_json = req.get_json()
                new_meeting = models.Meeting(
                    title=req_json.get('title'),
                    scheduled_time=req_json.get('scheduled_time'),
                    student_id=user.id,
                    status=models.MeetingStatus.SCHEDULED
                )
                db.add(new_meeting)
                db.commit()
                db.refresh(new_meeting)
                
                return func.HttpResponse(
                    json.dumps({"id": new_meeting.id, "message": "Meeting created"}),
                    status_code=201,
                    headers={
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'https://trackademic.uk',
                        'Access-Control-Allow-Credentials': 'true'
                    }
                )
            except Exception as e:
                return func.HttpResponse(
                    json.dumps({"detail": f"Error creating meeting: {str(e)}"}),
                    status_code=400,
                    headers={'Content-Type': 'application/json'}
                )
    
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"detail": f"Server error: {str(e)}"}),
            status_code=500,
            headers={'Content-Type': 'application/json'}
        )
