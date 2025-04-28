# -*- coding: utf-8 -*-
import argparse
import bcrypt
from src.utils.database import SessionLocal
from src.models import User
from src.utils.enums import UserRole

def reset_admin_password(username: str, password: str = None):
    """Reset password for the specified admin user"""
    if not password:
        password = input("Enter new password: ").strip()
    
    db = SessionLocal()
    try:
        admin = db.query(User).filter(
            User.username == username,
            User.role == UserRole.ADMIN
        ).first()
        
        if not admin:
            print(f"Admin user '{username}' not found")
            return

        # Hash new password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin.password_hash = hashed_password
        
        db.commit()
        print(f"Password reset successfully for admin user '{username}'")
        
    except Exception as e:
        print(f"Error resetting password: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    parser = argparse.ArgumentParser(description="Reset admin password")
    parser.add_argument("--username", required=True, help="Admin username")
    parser.add_argument("--password", help="New password")
    
    args = parser.parse_args()
    reset_admin_password(args.username, args.password)

if __name__ == "__main__":
    main() 