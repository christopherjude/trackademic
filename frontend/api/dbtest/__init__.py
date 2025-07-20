import azure.functions as func
import json
import sys
import os

# Add the api directory to path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        result = {
            "environment": {},
            "imports": {},
            "database": {},
            "connection": {}
        }
        
        # Check environment variables
        env_vars = ["DATABASE_URL", "DB_HOST", "DB_PORT", "DB_NAME", "DB_USER"]
        for var in env_vars:
            value = os.getenv(var)
            if var in ["DATABASE_URL"] and value:
                # Mask sensitive parts
                result["environment"][var] = value.split('@')[0] + '@***' if '@' in value else "***"
            else:
                result["environment"][var] = "SET" if value else "NOT_SET"
        
        # Test basic imports first
        try:
            from database import get_db, create_tables, test_connection, DATABASE_URL
            import models
            result["imports"]["status"] = "success"
            result["imports"]["database_url_type"] = "mysql" if "mysql" in DATABASE_URL else "other"
        except Exception as import_error:
            result["imports"]["status"] = "failed"
            result["imports"]["error"] = str(import_error)
            result["imports"]["type"] = type(import_error).__name__
            
            return func.HttpResponse(
                json.dumps(result, indent=2),
                status_code=500,
                headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
            )

        # Test database connection using our test function
        try:
            connection_ok = test_connection()
            result["connection"]["test_result"] = "success" if connection_ok else "failed"
        except Exception as conn_error:
            result["connection"]["test_result"] = "failed"
            result["connection"]["error"] = str(conn_error)
            result["connection"]["type"] = type(conn_error).__name__

        # Test table creation
        try:
            create_tables()
            result["database"]["tables"] = "created/verified successfully"
        except Exception as db_error:
            result["database"]["tables"] = "failed"
            result["database"]["error"] = str(db_error)
            result["database"]["type"] = type(db_error).__name__

        # Test getting a database session
        try:
            db = next(get_db())
            
            # Try a simple query
            try:
                db.execute("SELECT 1 as test")
                result["connection"]["query_test"] = "success"
            except Exception as query_error:
                result["connection"]["query_test"] = "failed"
                result["connection"]["query_error"] = str(query_error)
            
            db.close()
            result["connection"]["session"] = "success"
        except Exception as sess_error:
            result["connection"]["session"] = "failed"
            result["connection"]["session_error"] = str(sess_error)

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
