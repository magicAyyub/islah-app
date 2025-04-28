"""
Admin CLI commands for user management
"""

import sys
import argparse
from rich.console import Console
from rich.panel import Panel
from src.utils.console import run_in_container

console = Console()


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
        console.print("\n[bold cyan]Creating admin user...[/]")
        result = run_in_container(command, capture_output=True)
        console.print("[bold green]✓[/] Admin user created successfully")
        
        if not username and not password:
            console.print(Panel(
                "[bold cyan]Admin Credentials[/]\n"
                "[dim]Username:[/] [cyan]admin[/]    [dim]Password:[/] [cyan]admin123[/]",
                border_style="cyan",
                padding=(1, 2),
                width=50
            ))
    except Exception as e:
        console.print(f"[bold red]×[/] Failed to create admin user: {e}")
        sys.exit(1)

def list_admins() -> None:
    """
    List all admin users
    """
    command = "poetry run python -m src.scripts.list_admins"
    try:
        console.print("\n[bold cyan]Listing admin users...[/]")
        run_in_container(command)
    except Exception as e:
        console.print(f"[bold red]×[/] Failed to list admin users: {e}")
        sys.exit(1)

def reset_admin_password(username: str, password: str = None) -> None:
    """
    Reset admin user password
    """
    command = f"poetry run python -m src.scripts.reset_admin_password --username {username}"
    if password:
        command += f" --password {password}"
    
    try:
        console.print(f"\n[bold cyan]Resetting password for admin user '{username}'...[/]")
        result = run_in_container(command, capture_output=True)
        console.print(f"[bold green]✓[/] Password for user '{username}' reset successfully")
        
        # If password was generated randomly, show it to the user
        if not password and "New password:" in result.stdout:
            import re
            match = re.search(r"New password: ([^\s]+)", result.stdout)
            if match:
                generated_password = match.group(1)
                console.print(Panel(
                    f"[bold cyan]New Credentials[/]\n"
                    f"[dim]Username:[/] [cyan]{username}[/]    [dim]Password:[/] [cyan]{generated_password}[/]",
                    border_style="cyan",
                    padding=(1, 2),
                    width=50
                ))
    except Exception as e:
        console.print(f"[bold red]×[/] Failed to reset admin password: {e}")
        sys.exit(1)

def admin_cli():
    """
    CLI for admin user management.
    """
    parser = argparse.ArgumentParser(description="Admin user management commands")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Create admin
    create_parser = subparsers.add_parser("create", help="Create new admin user")
    create_parser.add_argument("--username", help="Admin username")
    create_parser.add_argument("--password", help="Admin password")
    create_parser.add_argument("--full-name", help="Admin full name")

    # List admins
    subparsers.add_parser("list", help="List all admin users")

    # Reset admin password
    reset_parser = subparsers.add_parser("reset-password", help="Reset admin password")
    reset_parser.add_argument("username", help="Admin username")
    reset_parser.add_argument("--password", help="New password")

    # Parse arguments
    args = parser.parse_args(sys.argv[1:])

    # Execute commands
    if args.command == "create":
        create_admin(
            username=args.username,
            password=args.password,
            full_name=args.full_name
        )
    elif args.command == "list":
        list_admins()
    elif args.command == "reset-password":
        reset_admin_password(args.username, args.password)
    else:
        parser.print_help()

if __name__ == "__main__":
    admin_cli()