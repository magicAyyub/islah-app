"""
Entry point to setup FastAPI app.
"""
import logging
from src.app.api import fast_api_app
from src.app.api.middleware import setup_middlewares
from src.app.api.exception_handlers import setup_exception_handlers
from src.app.api.routes_register import register_routes
from src.app.api.tables_setup import setup_database
from src.utils.response_models import APIResponse

app = fast_api_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("islah_school") 


 
# Setup all parts
setup_database()
setup_middlewares(app)
setup_exception_handlers(app)
register_routes(app)

# Root endpoints
@app.get("/")
async def root():
    return APIResponse(
        success=True,
        message="Welcome to Islah School API",
        data={
            "docs": "/docs",
            "redoc": "/redoc",
            "version": "1.0.0"
        }
    )

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}