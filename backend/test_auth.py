#!/usr/bin/env python3
"""
Test script to verify the authentication logic works correctly
"""
import sys
import os
sys.path.append('/home/codejvnkie/school-projects/trackademic-web/backend')

# Force reload modules
import importlib
import auth
importlib.reload(auth)

def test_auth():
    print("Testing authentication logic...")
    
    # Test Alice's token
    alice_payload = auth.decode_token("alice-token")
    print(f"Alice token payload: {alice_payload}")
    
    # Test Bob's token  
    bob_payload = auth.decode_token("bob-token")
    print(f"Bob token payload: {bob_payload}")
    
    # Test unknown token (should default to Alice)
    unknown_payload = auth.decode_token("unknown-token")
    print(f"Unknown token payload: {unknown_payload}")

if __name__ == "__main__":
    test_auth()
