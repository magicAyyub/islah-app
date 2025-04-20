"""
Configuration settings for the application.
"""

from typing import List


ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:3000/api",
    "localhost:3000/api",
]

# JWT settings
SECRET_KEY: str = "1e2f052c8e371df5be823a4bb11ac06215c2847bdce552e4cc807e1d06207546" 
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week
REFRESH_TOKEN_EXPIRE_DAYS: int = 7

# Application settings
DEBUG: bool = True