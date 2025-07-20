import azure.functions as func
import json
import os
from database import test_connection

def main(req: func.HttpRequest) -> func.HttpResponse:
    # Handle CORS preflight
    if req.method == 'OPTIONS':
        return func.HttpResponse(
            status_code=200,
            headers={
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        )

    # Health check response
    health_status = {
        "status": "healthy",
        "timestamp": func.datetime.datetime.utcnow().isoformat(),
        "database": "disconnected",
        "environment": {
            "DATABASE_URL": "SET" if os.getenv("DATABASE_URL") else "NOT_SET",
            "DB_HOST": "SET" if os.getenv("DB_HOST") else "NOT_SET",
            "AZURE_CLIENT_ID": "SET" if os.getenv("AZURE_CLIENT_ID") else "NOT_SET"
        }
    }
    
    # Test database connection
    try:
        if test_connection():
            health_status["database"] = "connected"
        else:
            health_status["database"] = "connection_failed"
            health_status["status"] = "unhealthy"
    except Exception as e:
        health_status["database"] = f"error: {str(e)}"
        health_status["status"] = "unhealthy"
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    
    return func.HttpResponse(
        json.dumps(health_status, indent=2),
        status_code=status_code,
        headers={
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    )
