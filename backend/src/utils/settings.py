"""
Configuration settings for the application.
"""

from typing import List, Any
from fastapi.openapi.utils import get_openapi


ORIGINS: List[str] = [
    "http://localhost:3000",
    "http://localhost:3000/api",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3000/api",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:3000/api",  
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

# Custom OpenAPI schema to properly configure OAuth2 password flow
def custom_openapi(app: Any) -> dict:
    """
    Custom OpenAPI schema to configure OAuth2 password flow.
    """
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="Islah School API",
        version="1.0.0",
        description="API pour la gestion de l'école de la mosquée Islah",
        routes=app.routes,
    )
    
    # Initialize components if it doesn't exist
    if "components" not in openapi_schema:
        openapi_schema["components"] = {}
    
    # Configure OAuth2 password flow
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": "/api/auth/token",
                    "scopes": {}
                }
            }
        }
    }
    
    # Apply security to all operations except /auth/token
    for path_url, path_item in openapi_schema["paths"].items():
        if path_url != "/api/auth/token":  # Skip the token endpoint
            for operation in path_item.values():
                if "security" not in operation:
                    operation["security"] = []
                operation["security"].append({"OAuth2PasswordBearer": []})
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema
