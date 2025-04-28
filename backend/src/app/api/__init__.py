from fastapi import FastAPI
from src.utils.settings import custom_openapi

fast_api_app = FastAPI(
    title="Islah School API",
    description="API pour la gestion de l'école de la mosquée Islah",
    version="1.0.0",
    openapi_tags=[
        {"name": "Authentication", "description": "Operations related to authentication"},
        {"name": "Users", "description": "Operations related to users"},
        # More tags here
    ],
    swagger_ui_parameters={"persistAuthorization": True}
)

# Custom OpenAPI schema
fast_api_app.openapi = lambda: custom_openapi(fast_api_app)
app = fast_api_app