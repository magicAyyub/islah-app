""" 
Islah School API Management Script
This script provides a command-line interface for managing the Islah School API project.
It includes commands for setting up the environment, managing Docker containers,
and performing database operations.
"""


import sys
import os
from pathlib import Path
import subprocess
from typing import Dict
import asyncio
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from src.utils.console import (
    print_banner, print_success, print_error, prompt_setup_type, 
    run_command, wait_for_container_ready, run_in_container
)
from src.utils.settings import DEFAULT_CONFIG

console = Console()


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
    print_success("✓ Created .env file with default configuration")

def check_docker_compose():
    """
    Vérifie si Docker et Docker Compose sont installés.
    """
    try:
        subprocess.run(["docker", "--version"], check=True, capture_output=True)
        subprocess.run(["docker-compose", "--version"], check=True, capture_output=True)
        print_success("✓ Docker et Docker Compose sont installés.")
    except FileNotFoundError:
        print_error("Docker ou Docker Compose n'est pas installé. Veuillez l'installer avant de continuer.")
        exit(1)

def build_and_run_docker():
    """
    Lance la construction et l'exécution avec docker-compose.
    """
    try:
        print("\n--- Lancement de Docker Compose ---")
        print("!!  Cela peut prendre un certain temps pour la première")
        subprocess.run(["docker-compose", "up", "--build", "-d"], check=True)
        print_success("✓ Docker Compose a été lancé avec succès.")
    except subprocess.CalledProcessError:
        print_error("Une erreur est survenue lors de l'exécution de Docker Compose. Assurez-vous que Docker-desktop est en cours d'exécution.")
        exit(1)

def stop_docker():
    """
    Arrête les conteneurs Docker.
    """
    try:
        print("\n--- Arrêt de Docker Compose ---")
        subprocess.run(["docker-compose", "down"], check=True)
        print_success("✓ Docker Compose a été arrêté avec succès.")
    except subprocess.CalledProcessError:
        print_error("Une erreur est survenue lors de l'arrêt de Docker Compose.")
        exit(1)

def remove_docker_volumes():
    """
    Supprime les volumes Docker.
    """
    try:
        print("\n--- Suppression des volumes Docker ---")
        subprocess.run(["docker-compose", "down", "-v" ], check=True)
        print_success("✓ Les volumes Docker ont été supprimés avec succès.")
    except subprocess.CalledProcessError:
        print_error("Une erreur est survenue lors de la suppression des volumes Docker.")
        exit(1)

def show_docker_logs():
    """
    Affiche les logs des conteneurs Docker.
    """
    try:
        print("\n--- Affichage des logs Docker ---")
        subprocess.run(["docker-compose", "logs"], check=True)
    except subprocess.CalledProcessError:
        print_error("Une erreur est survenue lors de l'affichage des logs Docker.")
        exit(1)

def reset_docker():
    """
    Réinitialise les conteneurs Docker.
    """
    stop_docker()
    remove_docker_volumes()

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
        os.system("docker-compose --version")
        run_command(command="docker-compose up -d --build", capture=True)
        
        # Wait for services with status
        services = ["api", "db"]
        for service in services:
            if not wait_for_container_ready(service):
                raise Exception(f"{service} failed to start")
        
        # Setup database and admin with details
        console.print("\n[bold cyan]● Configuring Database[/]")
        console.print("  Running migrations...")
        # Run migrations from the project root
        run_in_container(command="cd /app && alembic upgrade head", capture_output=True)
        
        # Create database tables
        console.print("  Creating database tables...")
        run_in_container(command="cd /app && python -m src.scripts.create_tables", capture_output=True)
        
        console.print("\n[bold cyan]● Creating Admin User[/]")
        console.print("  Setting up default admin account...")
        run_in_container(command="cd /app && python -m src.scripts.create_admin", capture_output=True)
        
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
            "admin reset-password <username>": "Reset password",
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

def run_in_container(command: str, capture_output: bool = False) -> None:
    """
    Run a command in the API container.
    
    Args:
        command: The command to run
        capture_output: Whether to capture and return the output
    """
    try:
        # Run command from /app directory
        full_command = f"cd /app && {command}"
        result = subprocess.run(
            ["docker-compose", "exec", "-T", "api", "sh", "-c", full_command],
            check=True,
            capture_output=capture_output,
            text=True
        )
        if capture_output:
            return result.stdout
    except subprocess.CalledProcessError as e:
        print_error(f"Command failed: {e}")
        print("Showing container logs for debugging:")
        show_docker_logs()
        raise

# Update the poetry script entry point
if __name__ == "__main__":
    run_setup()
