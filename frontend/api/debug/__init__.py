import azure.functions as func
import json
import sys
import os

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Check what modules are available
        available_modules = []
        test_modules = [
            'sqlite3', 'json', 'os', 'sys', 'datetime', 'urllib', 'http',
            'sqlalchemy', 'pyodbc', 'azure', 'requests'
        ]
        
        for module in test_modules:
            try:
                __import__(module)
                available_modules.append(f"{module}: ✓")
            except ImportError:
                available_modules.append(f"{module}: ✗")
        
        # Check Python version and path
        python_info = {
            "python_version": sys.version,
            "python_path": sys.path,
            "environment_variables": dict(os.environ),
            "available_modules": available_modules
        }
        
        return func.HttpResponse(
            json.dumps(python_info, indent=2, default=str),
            status_code=200,
            headers={
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        )

    except Exception as e:
        return func.HttpResponse(
            json.dumps({
                "error": str(e),
                "type": type(e).__name__
            }),
            status_code=500,
            headers={'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        )
