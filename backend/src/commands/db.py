"""
db CLI commands for Database management
"""
import os
import sys
import subprocess
import argparse
from rich.console import Console
from dotenv import load_dotenv
from typing import Dict
from src.utils.console import run_in_container

console = Console()

# Default configuration
DEFAULT_CONFIG = {
    "DB_USER": "postgres",
    "DB_PASSWORD": "postgres",
    "DB_NAME": "islah_db",
    "DB_HOST": "db",
    "DB_PORT": "5432"
}


def get_db_credentials() -> Dict[str, str]:
    """
    Get database credentials from .env file or use defaults
    """
    load_dotenv()
    return {
        "user": os.getenv("DB_USER", DEFAULT_CONFIG["DB_USER"]),
        "password": os.getenv("DB_PASSWORD", DEFAULT_CONFIG["DB_PASSWORD"]),
        "host": os.getenv("DB_HOST", DEFAULT_CONFIG["DB_HOST"]),
        "port": os.getenv("DB_PORT", DEFAULT_CONFIG["DB_PORT"]),
        "database": os.getenv("DB_NAME", DEFAULT_CONFIG["DB_NAME"])
    }



def show_db_info() -> None:
    """
    Show current database connection information
    """
    db_config = get_db_credentials()
    console.print("\nCurrent Database Configuration:")
    console.print(f"  Host: {db_config['host']}")
    console.print(f"  Port: {db_config['port']}")
    console.print(f"  Database: {db_config['database']}")
    console.print(f"  User: {db_config['user']}")

def psql() -> None:
    """
    Open PostgreSQL interactive terminal using credentials from .env
    """
    db_config = get_db_credentials()
    
    # Build psql command with environment variables
    psql_command = (
        f"PGPASSWORD={db_config['password']} "
        f"psql -U {db_config['user']} "
        f"-d {db_config['database']}"
    )
    
    try:
        console.print(f"\n--- Connecting to {db_config['database']} as {db_config['user']} ---")
        run_in_container(psql_command, service="db")
    except subprocess.CalledProcessError as e:
        console.print(f"Failed to connect to database: {e}")
        console.print("\nTroubleshooting tips:")
        console.print("1. Check your database credentials in .env file")
        console.print("2. Make sure the database container is running (poetry run docker ps)")
        console.print("3. Try resetting the containers (poetry run reset)")
        sys.exit(1)

def db_cli():
    """
    Unified CLI for database operations
    """
    parser = argparse.ArgumentParser(description="Database management commands")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Info command
    subparsers.add_parser("info", help="Show database configuration")

    # Migrate command
    migrate_parser = subparsers.add_parser("migrate", help="Generate new migration")
    migrate_parser.add_argument("-m", "--message", help="Migration message")

    # Other commands
    subparsers.add_parser("upgrade", help="Apply pending migrations")
    subparsers.add_parser("downgrade", help="Rollback last migration")
    subparsers.add_parser("history", help="Show migration history")
    subparsers.add_parser("current", help="Show current version")
    subparsers.add_parser("status", help="Show database status")
    subparsers.add_parser("psql", help="Open PostgreSQL terminal")

    args = parser.parse_args()

    if args.command == "info":
        show_db_info()
    elif args.command == "migrate":
        message = args.message or input("Enter migration message (press Enter for autogenerate): ").strip()
        command = "poetry run alembic revision --autogenerate"
        if message:
            command += f" -m '{message}'"
        run_in_container(command)
        print("✓ Migration file generated successfully")
    elif args.command == "upgrade":
        db_upgrade()
    elif args.command == "downgrade":
        db_downgrade()
    elif args.command == "history":
        db_history()
    elif args.command == "current":
        db_current()
    elif args.command == "status":
        db_status()
    elif args.command == "psql":
        psql()
    else:
        parser.print_help()

def db_upgrade() -> None:
    """
    Apply all pending migrations.
    """
    run_in_container("poetry run alembic upgrade head")
    print("✓ Database upgraded successfully")

def db_downgrade() -> None:
    """
    Rollback the last migration.
    """
    run_in_container("poetry run alembic downgrade -1")
    print("✓ Last migration reverted successfully")

def db_history() -> None:
    """
    Show migration history.
    """
    run_in_container("poetry run alembic history")

def db_current() -> None:
    """
    Show current migration version.
    """
    run_in_container("poetry run alembic current")

def db_status() -> None:
    """
    Show database status and pending migrations.
    """
    run_in_container("poetry run alembic current")
    print("\nPending migrations:")
    run_in_container("poetry run alembic history -i")