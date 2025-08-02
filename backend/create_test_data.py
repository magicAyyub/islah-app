#!/usr/bin/env python3
"""Test classes endpoint and create sample data"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.models import Base, Class, Parent, User
from app.services.auth_service import AuthService

def create_test_data():
    """Create some test data for development"""
    
    # Create test database
    engine = create_engine("sqlite:///test_dev.db", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        print("🏗️ Creating test data...")
        
        # Create test user for authentication
        existing_user = db.query(User).filter(User.username == "admin").first()
        if not existing_user:
            from app.schemas.user import UserCreate
            user_data = UserCreate(
                username="admin",
                password="admin123",
                email="admin@test.com",
                first_name="Admin",
                last_name="User",
                role="admin"
            )
            test_user = AuthService.create_user(db, user_data)
            print(f"✅ Created admin user: {test_user.username}")
        else:
            print("✅ Admin user already exists")
        
        # Create test classes
        classes_data = [
            {
                "name": "Maternelle 1 - Matin",
                "level": "Maternelle 1",
                "time_slot": "9h00-12h00",
                "capacity": 15,
                "academic_year": "2024-2025"
            },
            {
                "name": "Maternelle 2 - Après-midi", 
                "level": "Maternelle 2",
                "time_slot": "14h00-17h00",
                "capacity": 18,
                "academic_year": "2024-2025"
            },
            {
                "name": "CP - Matin",
                "level": "CP",
                "time_slot": "8h30-11h30",
                "capacity": 20,
                "academic_year": "2024-2025"
            }
        ]
        
        for class_data in classes_data:
            existing_class = db.query(Class).filter(Class.name == class_data["name"]).first()
            if not existing_class:
                new_class = Class(**class_data)
                db.add(new_class)
                print(f"✅ Created class: {class_data['name']}")
        
        # Create test parents
        parents_data = [
            {
                "first_name": "Ahmed",
                "last_name": "Benali",
                "phone": "0123456789",
                "mobile": "0654321098",
                "email": "ahmed.benali@email.com",
                "address": "123 Rue de la Paix",
                "locality": "Casablanca"
            },
            {
                "first_name": "Fatima",
                "last_name": "El Mansouri", 
                "phone": "0123456790",
                "mobile": "0654321099",
                "email": "fatima.mansouri@email.com",
                "address": "456 Avenue Mohammed V",
                "locality": "Rabat"
            }
        ]
        
        for parent_data in parents_data:
            existing_parent = db.query(Parent).filter(
                Parent.first_name == parent_data["first_name"],
                Parent.last_name == parent_data["last_name"]
            ).first()
            if not existing_parent:
                new_parent = Parent(**parent_data)
                db.add(new_parent)
                print(f"✅ Created parent: {parent_data['first_name']} {parent_data['last_name']}")
        
        db.commit()
        print("\n🎉 Test data created successfully!")
        print("\nTo test:")
        print("1. Login with: username=admin, password=admin123")
        print("2. Try creating a student with the form")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
