import os
import jwt
import requests
from typing import Dict, Any
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
from functools import lru_cache
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

security = HTTPBearer()

AZURE_TENANT_ID = os.getenv("AZURE_TENANT_ID")
AZURE_CLIENT_ID = os.getenv("AZURE_CLIENT_ID")

if not AZURE_TENANT_ID:
    print("Warning: AZURE_TENANT_ID not set - authentication will not work")
if not AZURE_CLIENT_ID:
    print("Warning: AZURE_CLIENT_ID not set - authentication will not work")

@lru_cache(maxsize=1)
def get_azure_public_keys():
    """
    Fetch Azure AD public keys for JWT validation.
    Cached to avoid repeated requests.
    """
    try:
        jwks_url = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/discovery/v2.0/keys"
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not fetch Azure AD public keys: {e}"
        )

def validate_azure_jwt(token: str) -> Dict[str, Any]:
    """
    Validate Azure AD JWT token and return claims.
    """
    try:
        # Get public keys
        jwks = get_azure_public_keys()
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        # Find the matching public key
        public_key = None
        for key in jwks.get("keys", []):
            if key.get("kid") == kid:
                public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
                break
        
        if not public_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: key not found"
            )
        
        # First, decode without audience validation to check what type of token this is
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False, "verify_iss": False}
        )
        
        # Validate issuer
        actual_issuer = payload.get('iss')
        expected_issuers = [
            f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0",
            f"https://sts.windows.net/{AZURE_TENANT_ID}/",
            f"https://login.microsoftonline.com/{AZURE_TENANT_ID}/"
        ]
        
        if actual_issuer not in expected_issuers:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid issuer: {actual_issuer}"
            )
        
        # Check the audience - accept our custom API scope
        audience = payload.get("aud")
        valid_audiences = [
            f"api://{AZURE_CLIENT_ID}",  # Our custom API scope
            AZURE_CLIENT_ID,  # Our app (fallback)
            "00000003-0000-0000-c000-000000000000",  # Microsoft Graph (fallback)
        ]
        
        if audience not in valid_audiences:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid audience: {audience}"
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}"
        )

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user from Azure AD JWT token.
    Validates the token and looks up the user in the database.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Validate Azure AD JWT token
    payload = validate_azure_jwt(credentials.credentials)
    azure_oid = payload.get("oid")
    email = payload.get("email") or payload.get("preferred_username")
    
    # Look up user by Azure OID first (most reliable)
    user = None
    if azure_oid:
        user = db.query(User).filter(User.azure_oid == azure_oid).first()
    
    # Fallback to email lookup
    if not user and email:
        user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in database"
        )
    
    return user
