import azure.functions as func
import json
import sys
import os

# Add the api directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Test basic imports first
        try:
            from database import get_db, create_tables
            import models
            result = {"imports": "success"}
        except Exception as import_error:
            return func.HttpResponse(
                json.dumps({
                    "error": "Import failed",
                    "details": str(import_error),
                    "type": type(import_error).__name__
                }),
                status_code=500,
                headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            )

        # Test database connection
        try:
            # Try to create tables
            create_tables()
            result["database"] = "tables created successfully"
        except Exception as db_error:
            result["database"] = f"Database error: {str(db_error)}"

        # Test getting a database session
        try:
            db = next(get_db())
            db.close()
            result["connection"] = "database session successful"
        except Exception as conn_error:
            result["connection"] = f"Connection error: {str(conn_error)}"

        return func.HttpResponse(
            json.dumps(result, indent=2),
            status_code=200,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        )

    except Exception as e:
        return func.HttpResponse(
            json.dumps({
                "error": "General error",
                "details": str(e),
                "type": type(e).__name__
            }),
            status_code=500,
            headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        )
