"""
Script to create database tables.
"""
import os
import sys
from pathlib import Path

# Add the app directory to Python path
app_path = Path(__file__).parent.parent.parent
sys.path.append(str(app_path))

from src.utils.database import create_tables_if_not_exist
from src.app.models import (
    user, student, teacher, parent, subject,
    grade, classroom, level, payment, notification,
    attendance, dashboard
)

def main():
    """Create all database tables."""
    print("Creating database tables...")
    
    # List of all models to create tables for
    models = [
        user.User,
        student.Student,
        teacher.Teacher,
        parent.Parent,
        subject.Subject,
        grade.Grade,
        classroom.Classroom,
        level.Level,
        payment.Payment,
        notification.Notification,
        attendance.Attendance,
        dashboard.DashboardStat,
        dashboard.DashboardQuickAction,
        dashboard.RolePermission
    ]
    
    # Create tables
    create_tables_if_not_exist(models)
    print("Database tables created successfully!")

if __name__ == "__main__":
    main() 