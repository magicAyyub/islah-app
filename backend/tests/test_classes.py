"""Test class management functionality"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from app.database.models import Base, Parent, Class, Student, RegistrationStatus
from app.schemas.class_schema import ClassCreate, ClassUpdate
from app.services.class_service import create_class, get_class, get_classes, update_class, delete_class

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

def test_create_class(test_db):
    """Test creating a new class"""
    db = test_db
    
    class_data = ClassCreate(
        name="Maternelle 1 - Matin",
        level="Maternelle 1",
        time_slot="9:00-12:00",
        capacity=25,
        academic_year="2023-2024"
    )
    
    result = create_class(db=db, class_data=class_data)
    
    # Assertions
    assert result["id"] is not None
    assert result["name"] == "Maternelle 1 - Matin"
    assert result["level"] == "Maternelle 1"
    assert result["capacity"] == 25
    assert result["enrolled_students"] == 0
    assert result["available_spots"] == 25
    
    # Verify in database
    db_class = db.query(Class).filter(Class.id == result["id"]).first()
    assert db_class is not None
    assert db_class.name == "Maternelle 1 - Matin"

def test_create_duplicate_class(test_db):
    """Test that creating a duplicate class raises an error"""
    db = test_db
    
    class_data = ClassCreate(
        name="Maternelle 1 - Matin",
        level="Maternelle 1",
        time_slot="9:00-12:00",
        capacity=25,
        academic_year="2023-2024"
    )
    
    # Create first class
    create_class(db=db, class_data=class_data)
    
    # Try to create duplicate - should fail
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        create_class(db=db, class_data=class_data)
    
    assert exc_info.value.status_code == 400
    assert "already exists" in str(exc_info.value.detail)

def test_get_classes_with_filters(test_db):
    """Test getting classes with filters"""
    db = test_db
    
    # Create test classes
    classes_data = [
        ClassCreate(name="Mat1 - Matin", level="Maternelle 1", time_slot="9:00-12:00", capacity=20, academic_year="2023-2024"),
        ClassCreate(name="Mat1 - Soir", level="Maternelle 1", time_slot="14:00-17:00", capacity=20, academic_year="2023-2024"),
        ClassCreate(name="Mat2 - Matin", level="Maternelle 2", time_slot="9:00-12:00", capacity=22, academic_year="2023-2024"),
        ClassCreate(name="Mat1 - Matin", level="Maternelle 1", time_slot="9:00-12:00", capacity=25, academic_year="2024-2025"),
    ]
    
    for class_data in classes_data:
        create_class(db=db, class_data=class_data)
    
    # Test: Get all classes for 2023-2024
    classes_2023 = get_classes(db=db, academic_year="2023-2024")
    assert len(classes_2023) == 3
    
    # Test: Get Maternelle 1 classes
    mat1_classes = get_classes(db=db, level="Maternelle 1")
    assert len(mat1_classes) == 3  # 2 from 2023-2024 + 1 from 2024-2025
    
    # Test: Get Maternelle 1 classes for 2023-2024
    mat1_2023 = get_classes(db=db, academic_year="2023-2024", level="Maternelle 1")
    assert len(mat1_2023) == 2

def test_update_class(test_db):
    """Test updating a class"""
    db = test_db
    
    # Create a class
    class_data = ClassCreate(
        name="Test Class",
        level="Test Level",
        time_slot="9:00-12:00",
        capacity=20,
        academic_year="2023-2024"
    )
    created_class = create_class(db=db, class_data=class_data)
    
    # Update the class
    update_data = ClassUpdate(
        name="Updated Class",
        capacity=25
    )
    
    updated_class = update_class(db=db, class_id=created_class["id"], class_update=update_data)
    
    # Assertions
    assert updated_class["name"] == "Updated Class"
    assert updated_class["capacity"] == 25
    assert updated_class["level"] == "Test Level"  # Unchanged
    assert updated_class["available_spots"] == 25

def test_update_class_capacity_with_students(test_db):
    """Test that reducing capacity below enrolled students fails"""
    db = test_db
    
    # Create a class
    class_data = ClassCreate(
        name="Test Class",
        level="Test Level", 
        time_slot="9:00-12:00",
        capacity=20,
        academic_year="2023-2024"
    )
    created_class = create_class(db=db, class_data=class_data)
    
    # Create a parent and student
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
        gender="Male", parent_id=parent.id, class_id=created_class["id"],
        registration_status=RegistrationStatus.CONFIRMED,
        academic_year="2023-2024"
    )
    db.add(student)
    db.commit()
    
    # Try to reduce capacity below enrolled students
    update_data = ClassUpdate(capacity=0)
    
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        update_class(db=db, class_id=created_class["id"], class_update=update_data)
    
    assert exc_info.value.status_code == 400
    assert "Cannot reduce capacity" in str(exc_info.value.detail)

def test_delete_class(test_db):
    """Test deleting a class"""
    db = test_db
    
    # Create a class
    class_data = ClassCreate(
        name="Test Class",
        level="Test Level",
        time_slot="9:00-12:00", 
        capacity=20,
        academic_year="2023-2024"
    )
    created_class = create_class(db=db, class_data=class_data)
    
    # Delete the class
    result = delete_class(db=db, class_id=created_class["id"])
    
    # Assertions
    assert "deleted successfully" in result["message"]
    
    # Verify class is deleted
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        get_class(db=db, class_id=created_class["id"])
    
    assert exc_info.value.status_code == 404

def test_delete_class_with_students(test_db):
    """Test that deleting a class with students fails"""
    db = test_db
    
    # Create a class
    class_data = ClassCreate(
        name="Test Class",
        level="Test Level",
        time_slot="9:00-12:00",
        capacity=20,
        academic_year="2023-2024"
    )
    created_class = create_class(db=db, class_data=class_data)
    
    # Create a parent and student
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
        gender="Male", parent_id=parent.id, class_id=created_class["id"],
        registration_status=RegistrationStatus.PENDING,
        academic_year="2023-2024"
    )
    db.add(student)
    db.commit()
    
    # Try to delete class with students
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        delete_class(db=db, class_id=created_class["id"])
    
    assert exc_info.value.status_code == 400
    assert "Cannot delete class" in str(exc_info.value.detail)
