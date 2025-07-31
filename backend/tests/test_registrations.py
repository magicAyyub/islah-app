"""Test registration workflow"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from app.database.models import Base, Parent, Class, Student, RegistrationStatus
from app.schemas.registration import RegistrationCreate, ParentCreate, StudentCreate
from app.services.registration_service import register_student, get_available_classes, confirm_registration

@pytest.fixture
def test_db():
    """Create a fresh test database for each test"""
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_register_student(test_db):
    """Test student registration workflow"""
    
    db = test_db
    
    # Create test class
    test_class = Class(
        id=1,
        name="Grade 1 - Morning",
        level="Grade 1",
        time_slot="9:00-10:00",
        capacity=2,  # Small capacity for testing
        academic_year="2023-2024"
    )
    db.add(test_class)
    db.commit()
    
    # Test: Register a new student with new parent
    from app.services.registration_service import register_student
    
    registration_data = RegistrationCreate(
        parent=ParentCreate(
            first_name="John",
            last_name="Parent",
            address="123 Test St",
            locality="Test City",
            phone="123-456-7890",
            mobile="098-765-4321",
            email="john@parent.com"
        ),
        student=StudentCreate(
            first_name="Jane",
            last_name="Student",
            date_of_birth=date(2010, 1, 1),
            place_of_birth="Test City",
            gender="Female",
            class_id=1,
            academic_year="2023-2024"
        )
    )
    
    # Call the service
    result = register_student(db=db, registration=registration_data)
    
    # Assertions
    assert result["student_id"] is not None
    assert result["parent_id"] is not None
    assert result["registration_status"] == "pending"  # enum value is lowercase
    assert result["class_name"] == "Grade 1 - Morning"
    assert result["academic_year"] == "2023-2024"
    
    # Verify database state
    student = db.query(Student).filter(Student.id == result["student_id"]).first()
    assert student is not None
    assert student.registration_status == RegistrationStatus.PENDING
    assert student.first_name == "Jane"
    assert student.last_name == "Student"
    
    parent = db.query(Parent).filter(Parent.id == result["parent_id"]).first()
    assert parent is not None
    assert parent.first_name == "John"
    assert parent.last_name == "Parent"

def test_get_available_classes(test_db):
    """Test getting available classes for registration"""
    
    db = test_db
    
    # Create test classes
    class1 = Class(
        id=1,
        name="Grade 1 - Morning",
        level="Grade 1", 
        time_slot="9:00-10:00",
        capacity=2,
        academic_year="2023-2024"
    )
    
    class2 = Class(
        id=2,
        name="Grade 1 - Afternoon",
        level="Grade 1",
        time_slot="14:00-17:00", 
        capacity=3,
        academic_year="2023-2024"
    )
    
    class3 = Class(
        id=3,
        name="Grade 2 - Morning",
        level="Grade 2",
        time_slot="9:00-10:00",
        capacity=1,
        academic_year="2024-2025"  # Different year
    )
    
    db.add_all([class1, class2, class3])
    
    # Add one confirmed student to class1
    parent = Parent(
        first_name="Test", last_name="Parent",
        address="123 St", locality="City",
        phone="123456", mobile="654321", email="test@test.com"
    )
    db.add(parent)
    db.flush()
    
    student = Student(
        first_name="Test", last_name="Student",
        date_of_birth=date(2010, 1, 1), place_of_birth="City",
        gender="Male", parent_id=parent.id, class_id=1,
        registration_status=RegistrationStatus.CONFIRMED,
        academic_year="2023-2024"
    )
    db.add(student)
    db.commit()
    
    # Test: Get available classes for 2023-2024
    available_classes = get_available_classes(db=db, academic_year="2023-2024")
    
    # Assertions
    assert len(available_classes) == 2  # class1 has 1 spot left, class2 has 3 spots
    
    # Check class1 (should have 1 available spot)
    class1_result = next((c for c in available_classes if c["id"] == 1), None)
    assert class1_result is not None
    assert class1_result["available_spots"] == 1
    assert class1_result["enrolled_students"] == 1
    
    # Check class2 (should have 3 available spots)
    class2_result = next((c for c in available_classes if c["id"] == 2), None)
    assert class2_result is not None
    assert class2_result["available_spots"] == 3
    assert class2_result["enrolled_students"] == 0
    
    # class3 should not be included (different academic year)
    class3_result = next((c for c in available_classes if c["id"] == 3), None)
    assert class3_result is None

def test_confirm_registration(test_db):
    """Test confirming a pending registration"""
    
    db = test_db
    
    # Create test class
    test_class = Class(
        id=1,
        name="Grade 1 - Morning",
        level="Grade 1",
        time_slot="9:00-10:00",
        capacity=2,
        academic_year="2023-2024"
    )
    db.add(test_class)
    
    # Create parent and student
    parent = Parent(
        first_name="Test", last_name="Parent",
        address="123 St", locality="City", 
        phone="123456", mobile="654321", email="test@test.com"
    )
    db.add(parent)
    db.flush()
    
    student = Student(
        id=1,
        first_name="Test", last_name="Student",
        date_of_birth=date(2010, 1, 1), place_of_birth="City",
        gender="Male", parent_id=parent.id, class_id=1,
        registration_status=RegistrationStatus.PENDING,
        academic_year="2023-2024"
    )
    db.add(student)
    db.commit()
    
    # Test: Confirm registration
    result = confirm_registration(db=db, student_id=1)
    
    # Assertions
    assert result["student_id"] == 1
    assert result["registration_status"] == "confirmed"  # enum value is lowercase
    assert "successfully" in result["message"]
    
    # Verify database state
    updated_student = db.query(Student).filter(Student.id == 1).first()
    assert updated_student.registration_status == RegistrationStatus.CONFIRMED
