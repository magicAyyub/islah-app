import os
import sys
from pathlib import Path
import subprocess
from typing import Dict
from dotenv import load_dotenv
import argparse
import asyncio
import time
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from src.utils.console import (
    print_banner, print_success, print_error,
    print_warning, print_info, create_spinner,
    prompt_setup_type, prompt_db_config,
    create_header, create_step_progress, create_summary_table
)

console = Console()

# Default configuration
DEFAULT_CONFIG = {
    "DB_USER": "postgres",
    "DB_PASSWORD": "postgres",
    "DB_NAME": "islah_db",
    "DB_HOST": "db",
    "DB_PORT": "5432"
}

def get_user_input(prompt, default=None, required=True):
    """
    Récupère une entrée utilisateur avec un message personnalisé, 
    un défaut facultatif, et vérifie si la valeur est requise.
    """
    while True:
        user_input = input(f"{prompt} ({'Default: ' + default if default else 'Required'}): ").strip()
        if user_input:
            return user_input
        elif default is not None:
            return default
        elif required:
            print("This field is required. Please provide a value.")
        else:
            return ""

def create_env_file(env_path: Path, config: Dict[str, str] = None) -> None:
    """
    Creates .env file with default or custom configuration.
    """
    if config is None:
        config = DEFAULT_CONFIG

    if env_path.exists():
        print(".env file already exists, skipping creation")
        return

    env_content = "\n".join(f"{k}={v}" for k, v in config.items())
    
    with open(env_path, "w") as env_file:
        env_file.write(env_content)
    print("✓ Created .env file with default configuration")

def check_docker_compose():
    """
    Vérifie si Docker et Docker Compose sont installés.
    """
    try:
        subprocess.run(["docker", "--version"], check=True, capture_output=True)
        subprocess.run(["docker-compose", "--version"], check=True, capture_output=True)
        print("✓ Docker et Docker Compose sont installés.")
    except FileNotFoundError:
        print("Docker ou Docker Compose n'est pas installé. Veuillez l'installer avant de continuer.")
        exit(1)

def build_and_run_docker():
    """
    Lance la construction et l'exécution avec docker-compose.
    """
    try:
        print("\n--- Lancement de Docker Compose ---")
        print("!!  Cela peut prendre un certain temps pour la première")
        subprocess.run(["docker-compose", "up", "--build", "-d"], check=True)
        print("✓ Docker Compose a été lancé avec succès.")
    except subprocess.CalledProcessError:
        print("Une erreur est survenue lors de l'exécution de Docker Compose. Assurez-vous que Docker-desktop est en cours d'exécution.")
        exit(1)

def stop_docker():
    """
    Arrête les conteneurs Docker.
    """
    try:
        print("\n--- Arrêt de Docker Compose ---")
        subprocess.run(["docker-compose", "down"], check=True)
        print("✓ Docker Compose a été arrêté avec succès.")
    except subprocess.CalledProcessError:
        print("Une erreur est survenue lors de l'arrêt de Docker Compose.")
        exit(1)

def remove_docker_volumes():
    """
    Supprime les volumes Docker.
    """
    try:
        print("\n--- Suppression des volumes Docker ---")
        subprocess.run(["docker-compose", "down", "-v"], check=True)
        print("✓ Les volumes Docker ont été supprimés avec succès.")
    except subprocess.CalledProcessError:
        print("Une erreur est survenue lors de la suppression des volumes Docker.")
        exit(1)

def show_docker_logs():
    """
    Affiche les logs des conteneurs Docker.
    """
    try:
        print("\n--- Affichage des logs Docker ---")
        subprocess.run(["docker-compose", "logs"], check=True)
    except subprocess.CalledProcessError:
        print("Une erreur est survenue lors de l'affichage des logs Docker.")
        exit(1)

def reset_docker():
    """
    Réinitialise les conteneurs Docker.
    """
    stop_docker()
    remove_docker_volumes()
    build_and_run_docker()

def wait_for_container_ready(service: str, max_retries: int = 30) -> bool:
    """Wait for container to be ready"""
    for i in range(max_retries):
        try:
            result = run_command(f"docker-compose ps {service}", capture=True)
            if "Up" in result.stdout:
                console.print(f"  [green]✓[/] {service} is ready")
                return True
        except subprocess.CalledProcessError:
            pass
        time.sleep(1)
    return False

def run_in_container(command: str, service: str = "api", capture_output: bool = False) -> None:
    """Run a command in a Docker container"""
    try:
        if not wait_for_container_ready(service):
            console.print(f"[red]×[/] {service} is not ready")
            sys.exit(1)

        
        # First, check if the container is actually running
        status_check = subprocess.run(
            ["docker-compose", "ps", "-q", service],
            capture_output=True,
            text=True
        )
        
        if not status_check.stdout:
            console.print(f"[red]×[/] Container {service} is not running")
            sys.exit(1)

        # Use docker-compose exec with -T flag and set a timeout
        try:
            result = subprocess.run(
                ["docker-compose", "exec", "-T", service, "sh", "-c", command],
                capture_output=True,
                text=True,
                check=True,
                timeout=30  # Set a 30-second timeout
            )
            
            if result.stdout.strip() and not capture_output:
                print(result.stdout.strip())
            
            if result.stderr:
                console.print(f"[yellow]Warning:[/] {result.stderr}")
                
        except subprocess.TimeoutExpired:
            console.print(f"[red]×[/] Command timed out after 30 seconds: {command}")
            console.print("[info]Showing container logs for debugging:")
            subprocess.run(["docker-compose", "logs", service], check=False)
            raise Exception("Command timed out")
            
    except subprocess.CalledProcessError as e:
        console.print(f"[red]×[/] Command failed: {e}")
        if e.stdout:
            print("Output:", e.stdout)
        if e.stderr:
            console.print("[info]Showing container logs for debugging:")
            subprocess.run(["docker-compose", "logs", service], check=False)
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

    # Admin management commands
    admin_parser = subparsers.add_parser("admin", help="Admin user management")
    admin_subparsers = admin_parser.add_subparsers(dest="admin_command", help="Admin commands")

    # Create admin
    create_parser = admin_subparsers.add_parser("create", help="Create new admin user")
    create_parser.add_argument("--username", help="Admin username")
    create_parser.add_argument("--password", help="Admin password")
    create_parser.add_argument("--full-name", help="Admin full name")

    # List admins
    admin_subparsers.add_parser("list", help="List all admin users")

    # Reset admin password
    reset_parser = admin_subparsers.add_parser("reset-password", help="Reset admin password")
    reset_parser.add_argument("username", help="Admin username")
    reset_parser.add_argument("--password", help="New password")

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
    elif args.command == "admin":
        if args.admin_command == "create":
            create_admin(
                username=args.username,
                password=args.password,
                full_name=args.full_name
            )
        elif args.admin_command == "list":
            list_admins()
        elif args.admin_command == "reset-password":
            reset_admin_password(args.username, args.password)
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

def create_admin(username: str = None, password: str = None, full_name: str = None) -> None:
    """
    Create admin user with optional custom credentials
    """
    if username or password or full_name:
        # Create custom admin user
        command = "poetry run python -m src.scripts.create_admin"
        if username:
            command += f" --username {username}"
        if password:
            command += f" --password {password}"
        if full_name:
            command += f" --full-name '{full_name}'"
    else:
        # Create default admin user
        command = "poetry run python -m src.scripts.create_admin"
    
    try:
        console.print("\nCreating admin user...")
        run_in_container(command)
        console.print("✓ Admin user created successfully")
        
        if not username and not password:
            console.print("\nDefault admin credentials:")
            console.print("  Username: admin")
            console.print("  Password: admin123")
    except subprocess.CalledProcessError as e:
        console.print(f"Failed to create admin user: {e}")
        sys.exit(1)

def list_admins() -> None:
    """
    List all admin users
    """
    command = "poetry run python -m src.scripts.list_admins"
    try:
        console.print("\nListing admin users...")
        run_in_container(command)
    except subprocess.CalledProcessError as e:
        console.print(f"Failed to list admin users: {e}")
        sys.exit(1)

def reset_admin_password(username: str, password: str = None) -> None:
    """
    Reset admin user password
    """
    command = f"poetry run python -m src.scripts.reset_admin_password --username {username}"
    if password:
        command += f" --password {password}"
    
    try:
        console.print(f"\nResetting password for admin user '{username}'...")
        run_in_container(command)
        console.print("✓ Password reset successfully")
    except subprocess.CalledProcessError as e:
        console.print(f"Failed to reset admin password: {e}")
        sys.exit(1)

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

def run_command(command: str, capture: bool = False) -> subprocess.CompletedProcess:
    """Run a shell command with optional output capture"""
    try:
        return subprocess.run(
            command.split(),
            check=True,
            capture_output=capture,
            text=True
        )
    except subprocess.CalledProcessError as e:
        if capture:
            raise e
        console.print(f"[red]× Command failed:[/] {e}")
        sys.exit(1)

async def setup() -> None:
    """
    Main setup entry point.
    """
    print_banner("Welcome to Islah School API Setup!")
    
    setup_type = await prompt_setup_type()
    
    if setup_type == "quick":
        await quick_setup()
    else:
        await custom_setup()

def run_setup():
    """
    Wrapper function to run the async setup
    """
    asyncio.run(setup())

async def quick_setup() -> None:
    """Quick setup with default configuration"""
    try:
        console.print("\n[bold cyan]Setting up Islah School API[/]")
        
        # Initialize environment
        root_path = Path(__file__).parent.parent
        env_path = root_path / ".env"
        create_env_file(env_path)
        
        # Start services with informative output
        console.print("\n[bold cyan]● Starting Services[/]")
        console.print("  Starting containers...")
        run_command("docker-compose up -d --build", capture=True)
        
        # Wait for services with status
        services = ["api", "db"]
        for service in services:
            if not wait_for_container_ready(service):
                raise Exception(f"{service} failed to start")
        
        # Setup database and admin with details
        console.print("\n[bold cyan]● Configuring Database[/]")
        console.print("  Running migrations...")
        run_in_container("alembic upgrade head", capture_output=True)
        
        console.print("\n[bold cyan]● Creating Admin User[/]")
        console.print("  Setting up default admin account...")
        run_in_container("python -m src.scripts.create_admin", capture_output=True)
        
        # Show completion with compact credentials panel
        console.print("\n[bold green]✓ Setup Complete[/]")
        
        # Compact credential panel
        console.print(Panel(
            "[bold cyan]Admin Credentials[/]\n"
            "[dim]Username:[/] [cyan]admin[/]    [dim]Password:[/] [cyan]admin123[/]",
            border_style="cyan",
            padding=(1, 2),
            width=50
        ))
        
    except Exception as e:
        console.print(f"\n[bold red]× Error:[/] {str(e)}")
        sys.exit(1)

def custom_setup() -> None:
    """
    Interactive setup with custom configuration.
    """
    console.print("\nStarting custom setup...")
    
    config = {}
    console.print("\nDatabase configuration (press Enter to use defaults):")
    for key, default in DEFAULT_CONFIG.items():
        value = input(f"{key} ({default}): ").strip()
        config[key] = value if value else default

    root_path = Path(__file__).parent.parent
    env_path = root_path / ".env"
    create_env_file(env_path, config)

    try:
        # Start containers
        console.print("\nStarting Docker containers...")
        subprocess.run(["docker-compose", "up", "-d", "--build"], check=True)
        console.print("✓ Docker containers started")

        # Run migrations
        console.print("\nRunning database migrations...")
        run_in_container("poetry run alembic upgrade head")
        console.print("✓ Database migrations applied")

        # Create admin user
        console.print("\nCreating admin user...")
        run_in_container("poetry run python -m src.scripts.create_admin")
        console.print("✓ Admin user created")

        console.print("\n🎉 Setup completed successfully!")
        
    except subprocess.CalledProcessError as e:
        console.print(f"\nSetup failed: {e}")
        sys.exit(1)

def show_help() -> None:
    """Show available commands and their descriptions."""
    console.clear()
    
    # Create elegant header
    console.print(Panel.fit(
        "[bold cyan]Islah School API[/]",
        border_style="cyan",
        padding=(1, 4)
    ))

    # Create command groups with better spacing and organization
    commands = {
        "Setup": {
            "setup": "Initialize project environment",
            "help": "Show this help message",
        },
        "Docker": {
            "docker": "Start containers",
            "stop": "Stop containers",
            "reset": "Reset environment",
            "logs": "Show container logs",
        },
        "Database": {
            "db info": "Show configuration",
            "db migrate": "Generate migration",
            "db upgrade": "Apply migrations",
            "db downgrade": "Rollback migration",
            "db status": "Show status",
            "db psql": "Open PostgreSQL shell",
        },
        "Admin": {
            "admin create": "Create admin user",
            "admin list": "List admin users",
            "admin reset-password": "Reset password",
        }
    }
    
    for group, group_commands in commands.items():
        # Create elegant group headers
        console.print(f"\n[bold cyan]● {group}[/]")
        
        table = Table(show_header=False, box=None, padding=(0, 2))
        table.add_column("Command", style="cyan")
        table.add_column("Description", style="white")
        
        for cmd, desc in group_commands.items():
            table.add_row(f"poetry run {cmd}", desc)
        
        console.print(table)

# Update the poetry script entry point
if __name__ == "__main__":
    run_setup()
