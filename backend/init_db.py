#!/usr/bin/env python3
"""
Database initialization script for Islah School Management System.
This script creates all database tables and sets up initial data.
"""

from app.database.models import Base, User, Student, Payment, Parent, Class
from app.database.session import engine, SessionLocal
from app.services.auth_service import AuthService
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize the database with tables and initial data."""
    
    logger.info("🔧 Initializing database...")
    
    try:
        # Create all tables
        logger.info("📋 Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
        
        # Create initial admin user
        db = SessionLocal()
        try:
            # Check if admin user already exists
            existing_admin = db.query(User).filter(User.username == 'admin').first()
            
            if not existing_admin:
                logger.info("👤 Creating admin user...")
                admin_user = User(
                    username="admin",
                    email="admin@school.com",
                    first_name="Admin",
                    last_name="User",
                    role="admin",
                    password_hash=AuthService.get_password_hash("admin123"),
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.add(admin_user)
                db.commit()
                logger.info("✅ Admin user created successfully!")
            else:
                logger.info("ℹ️  Admin user already exists")
            
            # Create a sample teacher user
            existing_teacher = db.query(User).filter(User.username == 'teacher').first()
            if not existing_teacher:
                logger.info("👨‍🏫 Creating sample teacher user...")
                teacher_user = User(
                    username="teacher",
                    email="teacher@school.com",
                    first_name="Teacher",
                    last_name="Sample",
                    role="teacher",
                    password_hash=AuthService.get_password_hash("teacher123"),
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.add(teacher_user)
                db.commit()
                logger.info("✅ Sample teacher user created successfully!")
            else:
                logger.info("ℹ️  Teacher user already exists")
                
        finally:
            db.close()
            
        logger.info("🎉 Database initialization completed successfully!")
        logger.info("")
        logger.info("=== LOGIN CREDENTIALS ===")
        logger.info("Admin User:")
        logger.info("  Username: admin")
        logger.info("  Password: admin123")
        logger.info("")
        logger.info("Teacher User:")
        logger.info("  Username: teacher")
        logger.info("  Password: teacher123")
        logger.info("========================")
        
    except Exception as e:
        logger.error(f"❌ Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_database()
