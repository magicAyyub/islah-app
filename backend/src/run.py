"""
Run script for the FastAPI application.
"""
import uvicorn

def main():
    """Entry point for running the application."""
    uvicorn.run(
        "src.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 