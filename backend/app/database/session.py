from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Get the absolute path to the backend directory
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
database_path = os.path.join(backend_dir, "islam_school.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{database_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
