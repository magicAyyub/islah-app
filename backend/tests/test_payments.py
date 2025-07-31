import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import date

from app.database.models import Base, Parent, Class, Student, Payment
from app.schemas.payment import PaymentCreate

# Create test database setup
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def test_make_payment():
    """Test payment creation using direct database operations"""
    
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
            name="Grade 1 - Morning",
            level="Grade 1",
            time_slot="9:00-10:00",
            capacity=20,
            academic_year="2023-2024"
        )
        db.add(test_class)
        
        # Create test student
        test_student = Student(
            id=1,
            first_name="John",
            last_name="Doe",
            date_of_birth=date(2000, 1, 1),
            place_of_birth="Test City",
            gender="Male",
            parent_id=1,
            class_id=1,
            academic_year="2023-2024"
        )
        db.add(test_student)
        db.commit()
        
        # Test: Create payment using service logic
        from app.services.payment_service import make_payment
        
        payment_data = PaymentCreate(
            student_id=1,
            amount=150.00,
            payment_method="Cash",
            payment_type="inscription"
        )
        
        # Call the service directly
        created_payment = make_payment(db=db, payment=payment_data)
        
        # Assertions
        assert created_payment.student_id == 1
        assert created_payment.amount == 150.00
        assert created_payment.payment_method == "Cash"
        assert created_payment.id is not None
        assert created_payment.payment_date is not None
        
        # Verify payment was actually saved to database
        saved_payment = db.query(Payment).filter(Payment.id == created_payment.id).first()
        assert saved_payment is not None
        assert saved_payment.student_id == 1
        assert saved_payment.amount == 150.00
        assert saved_payment.payment_method == "Cash"
        
        # Verify the payment is linked to the correct student
        assert saved_payment.student_id == test_student.id
        
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)

def test_make_payment_different_methods():
    """Test payment creation with different payment methods"""
    
    # Setup: Create tables and test data
    Base.metadata.create_all(bind=test_engine)
    
    db = TestingSessionLocal()
    try:
        # Create minimal test data
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
        
        test_class = Class(
            id=1,
            name="Grade 1 - Morning",
            level="Grade 1",
            time_slot="9:00-10:00",
            capacity=20,
            academic_year="2023-2024"
        )
        db.add(test_class)
        
        test_student = Student(
            id=1,
            first_name="Jane",
            last_name="Smith",
            date_of_birth=date(2001, 6, 15),
            place_of_birth="Test City",
            gender="Female",
            parent_id=1,
            class_id=1,
            academic_year="2023-2024"
        )
        db.add(test_student)
        db.commit()
        
        # Test different payment methods
        from app.services.payment_service import make_payment
        
        payment_methods = ["Cash", "Credit Card", "Bank Transfer", "Check"]
        amounts = [100.0, 200.0, 300.0, 150.0]
        
        for i, (method, amount) in enumerate(zip(payment_methods, amounts)):
            payment_data = PaymentCreate(
                student_id=1,
                amount=amount,
                payment_method=method,
                payment_type="quarterly"
            )
            
            created_payment = make_payment(db=db, payment=payment_data)
            
            assert created_payment.student_id == 1
            assert created_payment.amount == amount
            assert created_payment.payment_method == method
            assert created_payment.id is not None
        
        # Verify all payments are in the database
        all_payments = db.query(Payment).filter(Payment.student_id == 1).all()
        assert len(all_payments) == 4
        
        # Check that all payment methods are represented
        saved_methods = [p.payment_method for p in all_payments]
        assert set(saved_methods) == set(payment_methods)
        
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)

def test_payment_student_relationship():
    """Test that payments are correctly linked to students"""
    
    # Setup: Create tables and test data
    Base.metadata.create_all(bind=test_engine)
    
    db = TestingSessionLocal()
    try:
        # Create test data for multiple students
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
        
        test_class = Class(
            id=1,
            name="Grade 1 - Morning",
            level="Grade 1",
            time_slot="9:00-10:00",
            capacity=20,
            academic_year="2023-2024"
        )
        db.add(test_class)
        
        # Create two students
        student1 = Student(
            id=1,
            first_name="Alice",
            last_name="Johnson",
            date_of_birth=date(2000, 3, 10),
            place_of_birth="Test City",
            gender="Female",
            parent_id=1,
            class_id=1,
            academic_year="2023-2024"
        )
        db.add(student1)
        
        student2 = Student(
            id=2,
            first_name="Bob",
            last_name="Wilson",
            date_of_birth=date(2001, 8, 20),
            place_of_birth="Test City",
            gender="Male",
            parent_id=1,
            class_id=1,
            academic_year="2023-2024"
        )
        db.add(student2)
        db.commit()
        
        # Create payments for both students
        from app.services.payment_service import make_payment
        
        # Payments for student 1
        payment1 = make_payment(db, PaymentCreate(student_id=1, amount=100.0, payment_method="Cash", payment_type="inscription"))
        payment2 = make_payment(db, PaymentCreate(student_id=1, amount=150.0, payment_method="Credit Card", payment_type="quarterly"))
        
        # Payment for student 2
        payment3 = make_payment(db, PaymentCreate(student_id=2, amount=200.0, payment_method="Bank Transfer", payment_type="inscription"))
        
        # Test relationships
        # Check payments for student 1
        student1_payments = db.query(Payment).filter(Payment.student_id == 1).all()
        assert len(student1_payments) == 2
        student1_total = sum(p.amount for p in student1_payments)
        assert student1_total == 250.0
        
        # Check payments for student 2
        student2_payments = db.query(Payment).filter(Payment.student_id == 2).all()
        assert len(student2_payments) == 1
        assert student2_payments[0].amount == 200.0
        
        # Verify each payment has the correct student_id
        assert payment1.student_id == 1
        assert payment2.student_id == 1
        assert payment3.student_id == 2
        
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)
