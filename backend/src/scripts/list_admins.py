# -*- coding: utf-8 -*-
from src.utils.database import SessionLocal
from src.app.models.user import User
from src.utils.enums import UserRole
from src.utils.console import print_banner, print_admin_table, print_error, print_info

def list_admin_users():
    """List all admin users"""
    print_banner("Admin Users")
    
    db = SessionLocal()
    try:
        admins = db.query(User).filter(User.role == UserRole.ADMIN).all()
        if not admins:
            print_info("No admin users found")
            return

        print_admin_table(admins)
        
    except Exception as e:
        print_error(f"Error listing admin users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_admin_users() 