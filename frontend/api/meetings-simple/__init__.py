import azure.functions as func
import json
from datetime import datetime

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Handle CORS preflight
        if req.method == 'OPTIONS':
            return func.HttpResponse(
                status_code=200,
                headers={
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Credentials': 'true'
                }
            )

        # For now, return mock data to test frontend integration
        if req.method == 'GET':
            mock_meetings = [
                {
                    "id": 1,
                    "title": "Weekly Progress Review",
                    "description": "Review project progress and milestones",
                    "scheduled_time": "2025-07-25T14:00:00Z",
                    "status": "scheduled",
                    "student_id": 1,
                    "supervisor_id": 2
                },
                {
                    "id": 2,
                    "title": "Thesis Discussion",
                    "description": "Discuss thesis chapter 3",
                    "scheduled_time": "2025-07-27T10:00:00Z",
                    "status": "pending",
                    "student_id": 1,
                    "supervisor_id": 2
                }
            ]
            
            return func.HttpResponse(
                json.dumps(mock_meetings),
                status_code=200,
                headers={
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            )
        
        elif req.method == 'POST':
            # Mock creation response
            try:
                req_body = req.get_json()
                new_meeting = {
                    "id": 999,
                    "title": req_body.get("title", "New Meeting"),
                    "description": req_body.get("description", ""),
                    "scheduled_time": req_body.get("scheduled_time", datetime.now().isoformat()),
                    "status": "scheduled",
                    "message": "Meeting created successfully (mock data)"
                }
                
                return func.HttpResponse(
                    json.dumps(new_meeting),
                    status_code=201,
                    headers={
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                )
            except Exception as e:
                return func.HttpResponse(
                    json.dumps({"error": f"Invalid JSON: {str(e)}"}),
                    status_code=400,
                    headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
                )
        
        else:
            return func.HttpResponse(
                json.dumps({"error": "Method not allowed"}),
                status_code=405,
                headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            )

    except Exception as e:
        return func.HttpResponse(
            json.dumps({
                "error": "Internal server error",
                "details": str(e)
            }),
            status_code=500,
            headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        )
