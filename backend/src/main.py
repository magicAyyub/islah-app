# -*- coding: utf-8 -*-
import uvicorn
from src.app import create_app

app = create_app()

def main():
    """Entry point for the application."""
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()