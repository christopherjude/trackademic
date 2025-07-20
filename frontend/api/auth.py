import os
import requests
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

security = HTTPBearer()

def get_azure_jwks():
    tenant_id = os.getenv("VITE_AZURE_TENANT_ID") or os.getenv("AZURE_TENANT_ID")
    if not tenant_id:
        raise RuntimeError("Azure Tenant ID not set in environment variables.")
    jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
    resp = requests.get(jwks_url)
    resp.raise_for_status()
    return resp.json()

# Cache for JWKS - will be loaded when first needed
_jwks_cache = None

def get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        _jwks_cache = get_azure_jwks()
    return _jwks_cache


from jose.utils import base64url_decode
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64

def decode_token(token: str):
    try:
        # Get unverified header to find kid
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header["kid"]
        jwks = get_jwks()  # Load JWKS when needed
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Public key not found in JWKS")
        
        # Build public key using cryptography (compatible with python-jose)
        n = base64url_decode(key["n"].encode())
        e = base64url_decode(key["e"].encode())
        
        # Convert to integers
        n_int = int.from_bytes(n, byteorder='big')
        e_int = int.from_bytes(e, byteorder='big')
        
        # Create RSA public key
        public_numbers = rsa.RSAPublicNumbers(e_int, n_int)
        public_key = public_numbers.public_key()
        
        # Convert to PEM format for jose
        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        # Decode and verify
        tenant_id = os.getenv("VITE_AZURE_TENANT_ID") or os.getenv("AZURE_TENANT_ID")
        client_id = os.getenv("VITE_AZURE_CLIENT_ID") or os.getenv("AZURE_CLIENT_ID")
        
        # The frontend requests tokens with audience "api://{client_id}/access_as_user"
        expected_audience = f"api://{client_id}/access_as_user"
        
        # Debug: Let's see what's actually in the token
        try:
            # First decode without verification to see the payload
            unverified_payload = jwt.get_unverified_claims(token)
            print(f"DEBUG: Token audience: {unverified_payload.get('aud')}")
            print(f"DEBUG: Expected audience: {expected_audience}")
            print(f"DEBUG: Token issuer: {unverified_payload.get('iss')}")
        except Exception as debug_e:
            print(f"DEBUG: Error decoding token for debug: {debug_e}")
        
        claims = jwt.decode(
            token,
            pem,
            algorithms=["RS256"],
            audience=expected_audience,
            issuer=f"https://login.microsoftonline.com/{tenant_id}/v2.0"
        )
        # Extract user info
        return {
            "oid": claims.get("oid"),
            "email": claims.get("preferred_username") or claims.get("email"),
            "given_name": claims.get("given_name", ""),
            "family_name": claims.get("family_name", ""),
            "roles": claims.get("roles", []),
            "claims": claims
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
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

    # Determine role from token (default to STUDENT if not present)
    role_from_token = None
    if payload["roles"]:
        # Use the first role in the list, map to UserRole enum if possible
        role_str = payload["roles"][0]
        try:
            role_from_token = models.UserRole[role_str.upper()]
        except (KeyError, AttributeError):
            role_from_token = models.UserRole.STUDENT
    else:
        role_from_token = models.UserRole.STUDENT

    if not user:
        user = models.User(
            azure_oid=payload["oid"],
            email=payload["email"],
            first_name=payload["given_name"],
            last_name=payload["family_name"],
            role=role_from_token
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Always update user info and role from token
        user.email = payload["email"]
        user.first_name = payload["given_name"]
        user.last_name = payload["family_name"]
        user.role = role_from_token
        db.commit()
        db.refresh(user)

    return user
