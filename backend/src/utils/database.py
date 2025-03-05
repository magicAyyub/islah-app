import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import NullPool

# Load environment variables
load_dotenv()

# Database configuration with fallback and validation
def get_database_url() -> str:
    """
    Construct database URL with comprehensive error checking.
    
    Raises:
        ValueError: If critical database configuration is missing
    """
    # Required environment variables
    required_vars = [
        "DB_USER", 
        "DB_PASSWORD", 
        "DB_NAME", 
        "DB_HOST", 
        "DB_PORT"
    ]
    
    # Check for missing critical environment variables
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        raise ValueError(f"Missing critical database environment variables: {', '.join(missing_vars)}")
    
    # Construct and return database URL
    return (
        f"postgresql://"
        f"{os.getenv('DB_USER')}:"
        f"{os.getenv('DB_PASSWORD')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:"
        f"{os.getenv('DB_PORT', '5432')}/"
        f"{os.getenv('DB_NAME')}"
    )

# Create SQLAlchemy engine with connection pooling and error handling
DATABASE_URL = get_database_url()
engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # Disable connection pooling for better connection management
    pool_pre_ping=True,  # Test connections before using them
    echo=False  # Set to True for SQL query logging during development
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine,
    expire_on_commit=False  # Keep objects usable after session closes
)

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

# Optional: Connection test function
def test_database_connection() -> bool:
    """
    Test the database connection.
    
    Returns:
        bool: True if connection is successful, False otherwise
    """
    try:
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

# Automatically test connection on import
if __name__ == "__main__":
    print("Testing database connection...")
    if test_database_connection():
        print("Database connection successful!")
    else:
        print("Database connection failed.")