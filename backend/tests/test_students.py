import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from app.main import app
from app.database.models import Base, Parent, Class, Student
from app.schemas.student import StudentCreate
from app.database.session import get_db

# Create test database
SQLITE_DATABASE_URL = "sqlite:///./test_students.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    """Create test client with isolated database."""
    # Create a fresh database for each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    # Override dependency only for this test session
    original_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    
    try:
        yield TestClient(app)
    finally:
        # Restore original override
        if original_override:
            app.dependency_overrides[get_db] = original_override
        else:
            app.dependency_overrides.pop(get_db, None)
        
        # Clean up database
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_student(db_session):
    """Test student creation using database operations"""
    return TestClient(app)

def test_create_student(db_session):
    """Test student creation using database operations"""
    
    # Create test parent
    test_parent = Parent(
        id=1,
        first_name="Test",
        last_name="Parent",
        address="123 Test St",
        locality="Test City",
        phone="123-456-7890",
        mobile="098-765-4321",
        email="test@parent.com"
    )
    db_session.add(test_parent)
    
    # Create test class
    test_class = Class(
        id=1,
        name="Grade 1 - Morning",
        level="Grade 1",
        time_slot="9:00-10:00",
        capacity=20,
        academic_year="2023-2024"
    )
    db_session.add(test_class)
    db_session.commit()
    
    # Test: Create student using service logic
    from app.services.student_service import create_student
    
    student_data = StudentCreate(
        first_name="John",
        last_name="Doe", 
        date_of_birth=date(2000, 1, 1),
        place_of_birth="City",
        gender="Male",
        parent_id=1,
        class_id=1,
        academic_year="2023-2024"
    )
    
    # Call the service directly
    created_student = create_student(db=db_session, student=student_data)
    
    # Assertions
    assert created_student.first_name == "John"
    assert created_student.last_name == "Doe"
    assert created_student.parent_id == 1
    assert created_student.class_id == 1
    assert created_student.id is not None
    
    # Verify student was actually saved to database
    saved_student = db_session.query(Student).filter(Student.id == created_student.id).first()
    assert saved_student is not None
    assert saved_student.first_name == "John"
