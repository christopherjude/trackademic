from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import os

security = HTTPBearer()

# Development mode check
DEVELOPMENT_MODE = os.getenv("DEVELOPMENT_MODE", "true").lower() == "true"

def decode_token(token: str):
    try:
        if DEVELOPMENT_MODE:
            # For development - map tokens to specific users
            user_mapping = {
                "alice-token": {
                    "oid": "alice-azure-oid-123",
                    "email": "alice@trackademic.uk",
                    "given_name": "Alice",
                    "family_name": "Studyalot"
                },
                "bob-token": {
                    "oid": "bob-azure-oid-456",
                    "email": "bob@trackademic.uk",
                    "given_name": "Bob",
                    "family_name": "Teachalot"
                },
                "candice-token": {
                    "oid": "candice-azure-oid-789",
                    "email": "candice@trackademic.uk",
                    "given_name": "Candice",
                    "family_name": "Adminalot"
                }
            }
            
            if token in user_mapping:
                return user_mapping[token]
            else:
                # Default to Alice for any other token in development
                return user_mapping["alice-token"]
        else:
            # Production: validate against Azure AD
            # TODO: Implement proper Azure AD token validation
            # For now, return mock data
            return {
                "oid": "azure-oid-from-token",
                "email": "user@trackademic.uk",
                "given_name": "Production",
                "family_name": "User"
            }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    token = credentials.credentials
    payload = decode_token(token)
    
    # Try to find user by Azure OID
    user = db.query(models.User).filter(models.User.azure_oid == payload["oid"]).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User not found with OID: {payload['oid']}"
        )
        db.refresh(user)
    
    return user
