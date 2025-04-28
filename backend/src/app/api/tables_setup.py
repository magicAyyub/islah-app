import src.models as models
from src.utils.database import create_tables_if_not_exist

def setup_database():
    create_tables_if_not_exist(
        [
            models.User, 
            models.Parent, 
            models.Level,
            models.Teacher,
            models.Classroom,
            models.Student,                
            models.Subject,
            models.Grade,
            models.Payment,
            models.Attendance,
            models.Notification,
        ]
    )