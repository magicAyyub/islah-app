"""
Configuration settings for the application.
"""

from typing import List


ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:3000/api",
    "http://localhost:3000/api/v1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/api",
    "http://127.0.0.1:3000/api/v1",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:3000/api",  
    "http://0.0.0.0:3000/api/v1",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8000/api",
    "http://127.0.0.1:8000/api/v1",
    "http://0.0.0.0:8000",
    "http://0.0.0.0:8000/api",
    "http://0.0.0.0:8000/api/v1",
]

# JWT settings
SECRET_KEY: str = "1e2f052c8e371df5be823a4bb11ac06215c2847bdce552e4cc807e1d06207546" 
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week
REFRESH_TOKEN_EXPIRE_DAYS: int = 7

# Application settings
DEBUG: bool = True

# Default Database configuration
DEFAULT_CONFIG = {
    "DB_USER": "postgres",
    "DB_PASSWORD": "postgres",
    "DB_NAME": "islah_db",
    "DB_HOST": "db",
    "DB_PORT": "5432"
}

# Project in formations 
PROJECT_NAME: str = "Islah School API"
PROJECT_DESCRIPTION: str = "API for Islah School"
API_VERSION: str = "v1"
