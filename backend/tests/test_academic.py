import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date, datetime

from app.main import app
from app.database.models import Base, User, Student, Class, Subject, Grade, Attendance, Parent
from app.database.session import get_db
from app.api.dependencies import get_current_user

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_academic.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Create test admin user
test_admin_user = User(
    id=1,
    username="test_admin",
    email="admin@test.com",
    first_name="Test",
    last_name="Admin",
    password_hash="hashed_password",
    role="admin",
    is_active=True
)

def override_get_current_user():
    return test_admin_user

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

@pytest.fixture(scope="function")
def setup_test_data():
    """Set up test data before each test."""
    db = TestingSessionLocal()
    
    # Clear existing data in proper order to handle foreign key constraints
    db.query(Attendance).delete()
    db.query(Grade).delete()
    db.query(Subject).delete()
    db.query(Student).delete()
    db.query(Class).delete()
    db.query(Parent).delete()
    db.query(User).delete()
    db.commit()
    
    # Create test user
    admin_user = User(
        id=1,
        username="test_admin",
        email="admin@test.com",
        first_name="Test",
        last_name="Admin",
        password_hash="hashed_password",
        role="admin",
        is_active=True
    )
    db.add(admin_user)
    
    # Create test class
    test_class = Class(
        id=1,
        name="Test Class A",
        level="Primary",
        time_slot="10h-13h",
        capacity=30,
        academic_year="2023-2024"
    )
    db.add(test_class)
    
    # Create test parent first
    test_parent = Parent(
        id=1,
        first_name="John",
        last_name="Parent",
        phone="1234567890",
        email="parent@test.com"
    )
    db.add(test_parent)
    
    # Create test student
    test_student = Student(
        id=1,
        first_name="John",
        last_name="Doe",
        date_of_birth=date(2010, 1, 1),
        place_of_birth="Test City",
        gender="Male",
        parent_id=1,
        class_id=1,
        academic_year="2023-2024",
        registered_by=1
    )
    db.add(test_student)
    
    # Create test subject
    test_subject = Subject(
        id=1,
        name="Mathematics",
        code="MATH",
        description="Basic Mathematics",
        class_id=1,
        teacher_id=1,
        academic_year="2023-2024"
    )
    db.add(test_subject)
    
    db.commit()
    db.close()
    
    yield
    
    # Cleanup after test in proper order
    db = TestingSessionLocal()
    db.query(Attendance).delete()
    db.query(Grade).delete()
    db.query(Subject).delete()
    db.query(Student).delete()
    db.query(Class).delete()
    db.query(Parent).delete()
    db.query(User).delete()
    db.commit()
    db.close()

class TestSubjects:
    def test_create_subject(self, setup_test_data):
        """Test creating a new subject."""
        subject_data = {
            "name": "Science",
            "code": "SCI",
            "description": "General Science",
            "class_id": 1,
            "teacher_id": 1,
            "academic_year": "2023-2024"
        }
        
        response = client.post("/academic/subjects/", json=subject_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["name"] == "Science"
        assert data["description"] == "General Science"
        assert data["class_id"] == 1
    
    def test_get_subjects(self, setup_test_data):
        """Test getting all subjects."""
        response = client.get("/academic/subjects/")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["name"] == "Mathematics"
    
    def test_get_subject_by_id(self, setup_test_data):
        """Test getting a specific subject."""
        response = client.get("/academic/subjects/1")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "Mathematics"
    
    def test_update_subject(self, setup_test_data):
        """Test updating a subject."""
        update_data = {
            "name": "Advanced Mathematics",
            "description": "Advanced level mathematics"
        }
        
        response = client.put("/academic/subjects/1", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "Advanced Mathematics"
        assert data["description"] == "Advanced level mathematics"
    
    def test_get_subjects_with_filters(self, setup_test_data):
        """Test getting subjects with filters."""
        response = client.get("/academic/subjects/?academic_year=2023-2024&class_id=1")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

class TestGrades:
    def test_create_grade(self, setup_test_data):
        """Test creating a new grade."""
        grade_data = {
            "student_id": 1,
            "subject_id": 1,
            "grade_value": 85.5,
            "max_grade": 100.0,
            "grade_type": "exam",
            "academic_period": "first_semester",
            "academic_year": "2023-2024",
            "assessment_date": "2023-10-15",
            "comments": "Good performance"
        }
        
        response = client.post("/academic/grades/", json=grade_data)
        if response.status_code != 201:
            print("Error response:", response.text)
        assert response.status_code == 201
        
        data = response.json()
        assert data["grade_value"] == 85.5
        assert data["student_id"] == 1
        assert data["subject_id"] == 1
    
    def test_create_bulk_grades(self, setup_test_data):
        """Test creating multiple grades at once."""
        bulk_data = {
            "subject_id": 1,
            "max_grade": 100.0,
            "grade_type": "quiz",
            "academic_period": "first_semester", 
            "academic_year": "2023-2024",
            "assessment_date": "2023-10-20",
            "grades": [
                {
                    "student_id": 1,
                    "grade_value": 92.0,
                    "comments": "Excellent work"
                }
            ]
        }
        
        response = client.post("/academic/grades/bulk", json=bulk_data)
        assert response.status_code == 201
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["grade_value"] == 92.0
    
    def test_get_student_grades(self, setup_test_data):
        """Test getting grades for a student."""
        # First create a grade
        grade_data = {
            "student_id": 1,
            "subject_id": 1,
            "grade_value": 75.0,
            "max_grade": 100.0,
            "grade_type": "homework",
            "academic_period": "first_semester",
            "academic_year": "2023-2024",
            "assessment_date": "2023-10-10"
        }
        client.post("/academic/grades/", json=grade_data)
        
        response = client.get("/academic/students/1/grades")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_grade_statistics(self, setup_test_data):
        """Test getting grade statistics for a student."""
        # First create some grades
        grades = [
            {"student_id": 1, "subject_id": 1, "grade_value": 80.0, "max_grade": 100.0,
             "grade_type": "exam", "academic_period": "first_semester", "academic_year": "2023-2024",
             "assessment_date": "2023-10-01"},
            {"student_id": 1, "subject_id": 1, "grade_value": 90.0, "max_grade": 100.0,
             "grade_type": "quiz", "academic_period": "first_semester", "academic_year": "2023-2024",
             "assessment_date": "2023-10-05"}
        ]
        
        for grade in grades:
            client.post("/academic/grades/", json=grade)
        
        response = client.get("/academic/students/1/grade-stats?subject_id=1")
        assert response.status_code == 200
        
        data = response.json()
        assert "average_grade" in data
        assert "highest_grade" in data
        assert "lowest_grade" in data
        assert data["total_assessments"] >= 2

class TestAttendance:
    def test_create_attendance(self, setup_test_data):
        """Test creating an attendance record."""
        attendance_data = {
            "student_id": 1,
            "class_id": 1,
            "attendance_date": "2023-10-15",
            "status": "present",
            "notes": "On time"
        }
        
        response = client.post("/academic/attendance/", json=attendance_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["student_id"] == 1
        assert data["status"] == "present"
    
    def test_create_bulk_attendance(self, setup_test_data):
        """Test creating bulk attendance records."""
        bulk_data = {
            "class_id": 1,
            "attendance_date": "2023-10-16",
            "attendance_records": [
                {
                    "student_id": 1,
                    "status": "present",
                    "notes": "Good attendance"
                }
            ]
        }
        
        response = client.post("/academic/attendance/bulk", json=bulk_data)
        assert response.status_code == 201
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["status"] == "present"
    
    def test_get_student_attendance(self, setup_test_data):
        """Test getting attendance for a student."""
        # First create attendance
        attendance_data = {
            "student_id": 1,
            "class_id": 1,
            "attendance_date": "2023-10-17",
            "status": "late"
        }
        client.post("/academic/attendance/", json=attendance_data)
        
        response = client.get("/academic/students/1/attendance")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_class_attendance(self, setup_test_data):
        """Test getting attendance for a class on a specific date."""
        # First create attendance
        attendance_data = {
            "student_id": 1,
            "class_id": 1,
            "attendance_date": "2023-10-18",
            "status": "absent"
        }
        client.post("/academic/attendance/", json=attendance_data)
        
        response = client.get("/academic/classes/1/attendance?attendance_date=2023-10-18")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_get_attendance_statistics(self, setup_test_data):
        """Test getting attendance statistics for a student."""
        # Create multiple attendance records
        attendance_records = [
            {"student_id": 1, "class_id": 1, "attendance_date": "2023-10-20", "status": "present"},
            {"student_id": 1, "class_id": 1, "attendance_date": "2023-10-21", "status": "present"},
            {"student_id": 1, "class_id": 1, "attendance_date": "2023-10-22", "status": "absent"}
        ]
        
        for record in attendance_records:
            client.post("/academic/attendance/", json=record)
        
        response = client.get("/academic/students/1/attendance-stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_days" in data
        assert "present_days" in data
        assert "absent_days" in data
        assert "attendance_rate" in data
        assert data["total_days"] >= 3
    
    def test_update_attendance(self, setup_test_data):
        """Test updating an attendance record."""
        # First create attendance
        attendance_data = {
            "student_id": 1,
            "class_id": 1,
            "attendance_date": "2023-10-25",
            "status": "present"
        }
        response = client.post("/academic/attendance/", json=attendance_data)
        attendance_id = response.json()["id"]
        
        # Update the attendance
        update_data = {
            "status": "late",
            "notes": "Arrived 10 minutes late"
        }
        
        response = client.put(f"/academic/attendance/{attendance_id}", json=update_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "late"
        assert data["notes"] == "Arrived 10 minutes late"

class TestErrorHandling:
    def test_get_nonexistent_subject(self, setup_test_data):
        """Test getting a subject that doesn't exist."""
        response = client.get("/academic/subjects/999")
        assert response.status_code == 404
    
    def test_get_nonexistent_grade(self, setup_test_data):
        """Test getting a grade that doesn't exist."""
        response = client.get("/academic/grades/999")
        assert response.status_code == 404
    
    def test_duplicate_attendance(self, setup_test_data):
        """Test creating duplicate attendance for same student/date."""
        attendance_data = {
            "student_id": 1,
            "class_id": 1,
            "attendance_date": "2023-10-30",
            "status": "present"
        }
        
        # First creation should succeed
        response1 = client.post("/academic/attendance/", json=attendance_data)
        assert response1.status_code == 201
        
        # Second creation should fail
        response2 = client.post("/academic/attendance/", json=attendance_data)
        assert response2.status_code == 400
    
    def test_invalid_grade_value(self, setup_test_data):
        """Test creating a grade with invalid values."""
        grade_data = {
            "student_id": 999,  # Non-existent student
            "subject_id": 1,
            "grade_value": 85.5,
            "max_grade": 100.0,
            "grade_type": "exam",
            "academic_period": "first_semester",  # Fix invalid enum value
            "academic_year": "2023-2024",
            "assessment_date": "2023-10-15"
        }
        
        response = client.post("/academic/grades/", json=grade_data)
        assert response.status_code == 400  # Should be 400 for business logic error (non-existent student)
