import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database.models import Base, Parent, Class, Student
from app.schemas.student import StudentCreate

# Create test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def test_create_student():
    """Test student creation using direct database operations"""
    
    # Setup: Create tables and test data
    Base.metadata.create_all(bind=test_engine)
    
    db = TestingSessionLocal()
    try:
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
        db.add(test_parent)
        
        # Create test class
        test_class = Class(
            id=1,
            level="Grade 1",
            time_slot="9:00-10:00",
            capacity=20
        )
        db.add(test_class)
        db.commit()
        
        # Test: Create student using service logic
        from app.services.student_service import create_student
        from datetime import date
        
        student_data = StudentCreate(
            first_name="John",
            last_name="Doe", 
            date_of_birth=date(2000, 1, 1),
            place_of_birth="City",
            gender="Male",
            parent_id=1,
            class_id=1
        )
        
        # Call the service directly
        created_student = create_student(db=db, student=student_data)
        
        # Assertions
        assert created_student.first_name == "John"
        assert created_student.last_name == "Doe"
        assert created_student.parent_id == 1
        assert created_student.class_id == 1
        assert created_student.id is not None
        
        # Verify student was actually saved to database
        saved_student = db.query(Student).filter(Student.id == created_student.id).first()
        assert saved_student is not None
        assert saved_student.first_name == "John"
        
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)
