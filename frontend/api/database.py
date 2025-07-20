from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os

# Support SQL Server, PostgreSQL, and SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./trackademic.db")

# Configure engine based on database type
if DATABASE_URL.startswith("mssql") or DATABASE_URL.startswith("sqlserver"):
    # SQL Server
    engine = create_engine(DATABASE_URL, echo=True if os.getenv("DEBUG") else False)
elif DATABASE_URL.startswith("postgresql"):
    # PostgreSQL
    engine = create_engine(DATABASE_URL, echo=True if os.getenv("DEBUG") else False)
else:
    # SQLite fallback for development
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}  # SQLite specific
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
