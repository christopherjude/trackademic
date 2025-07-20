import os
import jwt
from jwt import PyJWKClient
import logging

logger = logging.getLogger(__name__)

def decode_token(token: str) -> dict:
    """
    Decode and validate Azure AD JWT token
    """
    try:
        # Get tenant ID from environment
        tenant_id = os.getenv("AZURE_TENANT_ID")
        if not tenant_id:
            raise ValueError("AZURE_TENANT_ID environment variable not set")
        
        # Azure AD well-known endpoint for JWKS
        jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
        
        # Get the signing key
        jwks_client = PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decode the token
        decoded_token = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=os.getenv("AZURE_CLIENT_ID"),
            issuer=f"https://login.microsoftonline.com/{tenant_id}/v2.0"
        )
        
        return decoded_token
        
    except Exception as e:
        logger.error(f"Token validation failed: {e}")
        raise ValueError(f"Invalid token: {str(e)}")
