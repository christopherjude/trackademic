from typing import Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models

def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    """Simple authentication - check email and password directly"""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if user.password != password:  # Simple plain text password check
        return None
    return user

def get_current_user_by_id(user_id: int, db: Session = Depends(get_db)) -> Optional[models.User]:
    """Get user by ID - for simple session management"""
    return db.query(models.User).filter(models.User.id == user_id).first()
