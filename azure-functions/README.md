# Azure Functions - Trackademic Backend API

This is the backend API for Trackademic, built with Azure Functions and Python.

## Local Development

1. Install Azure Functions Core Tools
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run locally: `func start`

## Deployment

Deploy to Azure Functions using:
- Azure CLI
- VS Code Azure Functions extension
- GitHub Actions (CI/CD)

## Environment Variables

Set these in Azure Functions Configuration:
- `DATABASE_URL` - MySQL connection string
- `DB_HOST` - MySQL server host
- `DB_NAME` - Database name
- `DB_USER` - Database username  
- `DB_PASSWORD` - Database password
- `AZURE_CLIENT_ID` - Azure AD app client ID
- `AZURE_TENANT_ID` - Azure AD tenant ID
