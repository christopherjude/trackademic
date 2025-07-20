from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback: construct MySQL URL from individual environment variables
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    
    if all([DB_HOST, DB_NAME, DB_USER, DB_PASSWORD]):
        DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        logger.info(f"Constructed MySQL URL from environment variables")
    else:
        # Final fallback for local development
        DATABASE_URL = "sqlite:///./trackademic.db"
        logger.warning("Using SQLite fallback - set DATABASE_URL or MySQL environment variables for production")

logger.info(f"Database URL configured: {DATABASE_URL.split('@')[0]}@****" if '@' in DATABASE_URL else DATABASE_URL)

# Configure engine based on database type
try:
    if DATABASE_URL.startswith("mysql"):
        # MySQL with proper connection pool settings
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,  # Verify connections before use
            pool_recycle=300,    # Recycle connections every 5 minutes
            pool_size=5,         # Connection pool size
            max_overflow=10,     # Max overflow connections
            echo=True if os.getenv("DEBUG") else False
        )
    elif DATABASE_URL.startswith("mssql") or DATABASE_URL.startswith("sqlserver"):
        # SQL Server
        engine = create_engine(
            DATABASE_URL, 
            pool_pre_ping=True,
            echo=True if os.getenv("DEBUG") else False
        )
    elif DATABASE_URL.startswith("postgresql"):
        # PostgreSQL
        engine = create_engine(
            DATABASE_URL, 
            pool_pre_ping=True,
            echo=True if os.getenv("DEBUG") else False
        )
    else:
        # SQLite fallback for development
        engine = create_engine(
            DATABASE_URL, 
            connect_args={"check_same_thread": False}  # SQLite specific
        )
    
    logger.info("Database engine created successfully")
    
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    """Create database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        raise

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def test_connection():
    """Test database connection"""
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        logger.info("Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False
