# -*- coding: utf-8 -*-
import argparse
import bcrypt
from src.utils.database import SessionLocal
from src.app.models.user import User
from src.utils.enums import UserRole
from src.utils.console import (
    print_banner, print_success, print_error,
    print_info, print_warning, create_spinner, prompt_admin_creation
)
# Import all models to ensure relationships are properly registered
from src.app.models import (
    user, student, teacher, parent, subject,
    grade, classroom, level, payment, notification,
    attendance
)

def create_admin_user(username: str = "admin", password: str = "admin123", full_name: str = "Admin User"):
    """Create an admin user with the given credentials"""
    db = SessionLocal()
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.username == username).first()
        if admin:
            print_info("Admin user already exists")
            return
            
        # Create admin user with enum value
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin = User(
            username=username,
            password_hash=hashed_password,
            full_name=full_name,
            role=UserRole.ADMIN.value,  # Use .value to get the string value "admin"
            is_active=True
        )
        db.add(admin)
        db.commit()
        print_success(f"Admin user '{username}' created successfully!")
        
    except Exception as e:
        db.rollback()
        print_error(f"Failed to create admin user: {str(e)}")
        raise e
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description="Create admin user")
    parser.add_argument("--username", default="admin", help="Admin username")
    parser.add_argument("--password", default="admin123", help="Admin password")
    parser.add_argument("--full-name", default="Admin User", help="Admin full name")
    
    args = parser.parse_args()
    create_admin_user(args.username, args.password, args.full_name)

if __name__ == "__main__":
    main() 