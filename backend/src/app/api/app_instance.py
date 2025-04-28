from fastapi import FastAPI
from src.utils.settings import custom_openapi

app = FastAPI(
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
app.openapi = lambda: custom_openapi(app)