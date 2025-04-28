from fastapi.middleware.cors import CORSMiddleware
from src.utils.settings import ORIGINS

def setup_middlewares(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )