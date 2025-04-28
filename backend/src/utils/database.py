"""
Database connection and session management for SQLAlchemy.
This module provides functions to create a database engine, session management,
and table creation if they do not exist.
It uses environment variables to configure the database connection. 
"""
import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import NullPool
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables
load_dotenv()

def get_database_url() -> str:
    """Get database URL from environment variables with fallback values"""
    db_user = os.getenv("DB_USER", "postgres")
    db_password = os.getenv("DB_PASSWORD", "postgres")
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "islah_db")
    
    return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

SQLALCHEMY_DATABASE_URL = get_database_url()
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base for ORM models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency that creates a new database session for each request
    and closes it after the request is complete.
    
    Yields:
        Session: A database session
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        # Log any database-related exceptions
        print(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def create_tables_if_not_exist(models: list) -> None:
    """
    Create database tables only if they do not already exist.
    
    This method checks each table in the models before creating it,
    preventing errors from attempting to recreate existing tables.
    """
    inspector = inspect(engine)
    
    for model_class in models:
        # Check if table already exists
        if not inspector.has_table(model_class.__tablename__):
            # Create only if table doesn't exist
            model_class.__table__.create(engine)