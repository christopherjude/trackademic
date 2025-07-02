from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

security = HTTPBearer()

# For development, we'll create a simple token validation
# In production, you'd validate against Azure AD's public keys
def decode_token(token: str):
    try:
        # For development - just return mock user data
        # In production, validate against Azure AD
        return {
            "oid": "mock-user-id",
            "email": "test@example.com",
            "given_name": "Test",
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
    
    # If user doesn't exist, create them
    if not user:
        user = models.User(
            azure_oid=payload["oid"],
            email=payload["email"],
            first_name=payload["given_name"],
            last_name=payload["family_name"],
            role=models.UserRole.STUDENT  # Default role
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user
