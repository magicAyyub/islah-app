from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn, TimeElapsedColumn, BarColumn
from rich.theme import Theme
from rich.layout import Layout
from rich.live import Live
from rich.align import Align
from InquirerPy import inquirer
from InquirerPy.base.control import Choice
from InquirerPy.separator import Separator
import subprocess
import time

# Create themed console with custom styles
theme = Theme({
    "info": "cyan",
    "warning": "yellow",
    "error": "red bold",
    "success": "green",
    "header": "bold cyan",
    "step": "blue",
    "highlight": "magenta",
})

console = Console(theme=theme)

def create_header(title: str):
    """Create a styled header"""
    return Panel(
        Align.center(f"[header]{title}[/]"),
        border_style="cyan",
        padding=(1, 2)
    )

def create_step_progress():
    """Create a progress bar for setup steps"""
    return Progress(
        "[progress.description]{task.description}",
        BarColumn(complete_style="green", finished_style="green"),
        SpinnerColumn("dots"),
        TimeElapsedColumn(),
        console=console,
        expand=True
    )

def create_spinner(message: str):
    """Create a spinner for operations"""
    return Progress(
        SpinnerColumn("dots"),
        TextColumn("[progress.description]{task.description}"),
        TimeElapsedColumn(),
        console=console,
        transient=True
    )

def print_step(step: str, message: str):
    """Print a setup step"""
    console.print(f"[step]→[/] {step}: [highlight]{message}[/]")

def print_success(message: str):
    """Print success message"""
    console.print(f"[green]✓[/] {message}")

def print_error(message: str):
    """Print error message"""
    console.print(f"[red]✗[/] {message}")

def print_warning(message: str):
    """Print warning message"""
    console.print(f"[warning]![/] {message}")

def print_info(message: str):
    """Print info message"""
    console.print(f"[cyan]>[/] {message}")

def print_banner(title: str):
    """Print a styled banner"""
    console.print(f"\n[bold cyan]{title}[/]\n")

def print_admin_table(admins: list):
    """Print admin users in a table"""
    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Username")
    table.add_column("Full Name")
    table.add_column("Status")
    table.add_column("Last Login")

    for admin in admins:
        status = "[green]Active" if admin.is_active else "[red]Inactive"
        last_login = admin.last_login or "Never"
        table.add_row(
            admin.username,
            admin.full_name,
            status,
            str(last_login)
        )

    console.print(table)

async def prompt_setup_type():
    """Prompt for setup type"""
    return await inquirer.select(
        message="Select setup type:",
        choices=[
            Choice("quick", "Quick setup (recommended for development)"),
            Separator(),
            Choice("custom", "Custom setup (configure database settings)")
        ],
        default="quick",
        qmark="→",
        pointer="❯",
        instruction="(Use arrow keys and Enter to select)"
    ).execute_async()

async def prompt_admin_creation():
    """Prompt for admin user creation"""
    use_default = await inquirer.confirm(
        message="Use default admin credentials?",
        default=True,
        qmark="→",
        instruction="(Y/n)"
    ).execute_async()

    if use_default:
        return "admin", "admin123", "Admin User"

    username = await inquirer.text(
        message="Enter admin username:",
        default="admin",
        qmark="→"
    ).execute_async()

    password = await inquirer.secret(
        message="Enter admin password:",
        qmark="→",
        instruction="(Password will be hidden)"
    ).execute_async()

    full_name = await inquirer.text(
        message="Enter admin full name:",
        default="Admin User",
        qmark="→"
    ).execute_async()

    return username, password, full_name

async def prompt_db_config():
    """Prompt for database configuration"""
    use_default = await inquirer.confirm(
        message="Use default database configuration?",
        default=True,
        qmark="→",
        instruction="(Y/n)"
    ).execute_async()

    if use_default:
        return DEFAULT_CONFIG

    config = {}
    for key, default in DEFAULT_CONFIG.items():
        value = await inquirer.text(
            message=f"Enter {key}:",
            default=default,
            qmark="→"
        ).execute_async()
        config[key] = value

    return config

def create_summary_table(title: str, data: dict):
    """Create a summary table"""
    table = Table(title=title, show_header=True, header_style="bold cyan", border_style="cyan")
    table.add_column("Setting", style="cyan")
    table.add_column("Value", style="white")
    
    for key, value in data.items():
        table.add_row(key, str(value))
    
    return table

def wait_for_container_ready(service: str = "api", max_retries: int = 30) -> bool:
    """Wait for container to be ready"""
    for i in range(max_retries):
        try:
            result = subprocess.run(
                ["docker-compose", "ps", service],
                capture_output=True,
                text=True,
                check=True
            )
            if "Up" in result.stdout:
                return True
        except subprocess.CalledProcessError:
            pass
        time.sleep(1)
    return False 