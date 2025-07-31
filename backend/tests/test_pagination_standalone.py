import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date

from app.main import app
from app.database.models import Base, Student, Parent, Payment, Class, PaymentType, RegistrationStatus
from app.database.session import get_db

# Create test database
SQLITE_DATABASE_URL = "sqlite:///./test_pagination.db"
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
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def sample_data(db_session):
    """Create sample data for testing."""
    # Create parents
    parent1 = Parent(
        first_name="Ahmed",
        last_name="Hassan",
        phone="123456789",
        email="ahmed@example.com"
    )
    parent2 = Parent(
        first_name="Fatima",
        last_name="Ali",
        phone="987654321",
        email="fatima@example.com"
    )
    parent3 = Parent(
        first_name="Omar",
        last_name="Mohamed",
        phone="555666777",
        email="omar@example.com"
    )
    
    db_session.add_all([parent1, parent2, parent3])
    db_session.commit()
    
    # Create classes
    class1 = Class(
        name="Maternelle 1 - Matin",
        level="Maternelle 1",
        time_slot="10h-13h",
        capacity=20,
        academic_year="2024-2025"
    )
    class2 = Class(
        name="Maternelle 2 - Après-midi",
        level="Maternelle 2",
        time_slot="14h-17h",
        capacity=15,
        academic_year="2024-2025"
    )
    
    db_session.add_all([class1, class2])
    db_session.commit()
    
    # Create students
    students = []
    for i in range(25):  # Create 25 students for pagination testing
        student = Student(
            first_name=f"Student{i+1}",
            last_name=f"Last{i+1}",
            date_of_birth=date(2018 + (i % 3), 1, 1),  # Ages 6, 5, 4
            gender="M" if i % 2 == 0 else "F",
            parent_id=parent1.id if i < 10 else (parent2.id if i < 20 else parent3.id),
            class_id=class1.id if i % 2 == 0 else class2.id,
            registration_status=RegistrationStatus.CONFIRMED if i % 3 == 0 else RegistrationStatus.PENDING,
            academic_year="2024-2025"
        )
        students.append(student)
    
    db_session.add_all(students)
    db_session.commit()
    
    # Create payments
    payments = []
    for i, student in enumerate(students[:15]):  # Create payments for first 15 students
        payment = Payment(
            student_id=student.id,
            amount=100.0 + (i * 10),  # Varying amounts
            payment_method="Cash" if i % 2 == 0 else "Card",
            payment_type=PaymentType.INSCRIPTION if i < 8 else PaymentType.QUARTERLY,
            receipt_number=f"REC{2024}{i+1:03d}",
            payment_date=datetime(2024, 1 + (i % 12), 15)
        )
        payments.append(payment)
    
    db_session.add_all(payments)
    db_session.commit()
    
    return {
        "parents": [parent1, parent2, parent3],
        "classes": [class1, class2],
        "students": students,
        "payments": payments
    }

class TestStudentPagination:
    def test_basic_pagination(self, client, sample_data):
        """Test basic pagination functionality."""
        response = client.get("/students?page=1&size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "size" in data
        assert "pages" in data
        
        # Should have 10 items on first page
        assert len(data["items"]) == 10
        assert data["total"] == 25
        assert data["page"] == 1
        assert data["size"] == 10
        assert data["pages"] == 3

    def test_second_page(self, client, sample_data):
        """Test second page pagination."""
        response = client.get("/students?page=2&size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 10
        assert data["page"] == 2

    def test_last_page(self, client, sample_data):
        """Test last page with remaining items."""
        response = client.get("/students?page=3&size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 5  # Remaining students
        assert data["page"] == 3

    def test_search_by_name(self, client, sample_data):
        """Test search functionality."""
        response = client.get("/students?search=Student1&size=50")
        assert response.status_code == 200
        
        data = response.json()
        # Should find Student1, Student10-19 (contains "Student1")
        assert data["total"] >= 1
        
        # Verify all returned students contain "Student1" in name
        for student in data["items"]:
            assert "Student1" in student["first_name"]

    def test_filter_by_class(self, client, sample_data):
        """Test filtering by class."""
        response = client.get("/students?class_id=1&size=50")
        assert response.status_code == 200
        
        data = response.json()
        # Should find students in class 1 (even indexed students)
        expected_count = 13  # Students 0,2,4,6,8,10,12,14,16,18,20,22,24 (13 total)
        assert data["total"] == expected_count

    def test_filter_by_registration_status(self, client, sample_data):
        """Test filtering by registration status."""
        response = client.get("/students?registration_status=CONFIRMED&size=50")
        assert response.status_code == 200
        
        data = response.json()
        # Should find students with confirmed status (every 3rd student: 0,3,6,9,12,15,18,21,24)
        expected_count = 9
        assert data["total"] == expected_count

    def test_sorting(self, client, sample_data):
        """Test sorting functionality."""
        response = client.get("/students?sort_by=first_name&sort_order=desc&size=50")
        assert response.status_code == 200
        
        data = response.json()
        students = data["items"]
        
        # Verify descending order by first name
        for i in range(len(students) - 1):
            assert students[i]["first_name"] >= students[i + 1]["first_name"]

class TestPaymentPagination:
    def test_payment_pagination(self, client, sample_data):
        """Test payment pagination."""
        response = client.get("/payments?page=1&size=5")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 5
        assert data["total"] == 15  # We created 15 payments

    def test_payment_search(self, client, sample_data):
        """Test payment search by receipt number."""
        response = client.get("/payments?search=REC2024001&size=50")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] >= 1
        
        # Verify search results
        for payment in data["items"]:
            assert "REC2024001" in payment["receipt_number"]

    def test_payment_filter_by_type(self, client, sample_data):
        """Test filtering payments by type."""
        response = client.get("/payments?payment_type=INSCRIPTION&size=50")
        assert response.status_code == 200
        
        data = response.json()
        expected_count = 8  # First 8 payments are INSCRIPTION
        assert data["total"] == expected_count

    def test_payment_filter_by_amount_range(self, client, sample_data):
        """Test filtering payments by amount range."""
        response = client.get("/payments?min_amount=100&max_amount=250&size=50")
        assert response.status_code == 200
        
        data = response.json()
        # Verify all payments are in range
        for payment in data["items"]:
            assert 100 <= payment["amount"] <= 250

class TestClassPagination:
    def test_class_pagination(self, client, sample_data):
        """Test class pagination."""
        response = client.get("/classes?page=1&size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 2  # We created 2 classes
        assert data["total"] == 2

    def test_class_search(self, client, sample_data):
        """Test class search."""
        response = client.get("/classes?search=Maternelle&size=50")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 2  # Both classes contain "Maternelle"

    def test_class_filter_by_level(self, client, sample_data):
        """Test filtering classes by level."""
        response = client.get("/classes?level=Maternelle%201&size=50")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 1  # Only one class with "Maternelle 1"

class TestPaginationEdgeCases:
    def test_invalid_page_number(self, client, sample_data):
        """Test handling of invalid page numbers."""
        response = client.get("/students?page=0&size=10")
        assert response.status_code == 422  # Validation error

    def test_oversized_page(self, client, sample_data):
        """Test requesting page beyond available data."""
        response = client.get("/students?page=100&size=10")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["items"]) == 0  # No items on page 100
        assert data["total"] == 25  # But total is still correct

    def test_empty_results(self, client, sample_data):
        """Test pagination with no results."""
        response = client.get("/students?search=NonexistentName&size=50")
        assert response.status_code == 200
        
        data = response.json()
        assert data["total"] == 0
        assert len(data["items"]) == 0
