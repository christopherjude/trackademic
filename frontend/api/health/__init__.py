import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Simple health check endpoint"""
    return func.HttpResponse(
        json.dumps({
            "status": "healthy",
            "message": "TrackAdemic API is running",
            "method": req.method
        }),
        status_code=200,
        headers={
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    )
