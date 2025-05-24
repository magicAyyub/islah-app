# Use Python 3.13 base image
FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install poetry

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Configure poetry
RUN poetry config virtualenvs.create false

# Install dependencies without installing the root project
RUN poetry install --no-interaction --no-ansi --no-root

# Set working directory
WORKDIR /app

# Copy the rest of the application
COPY . .

# Install the project in development mode
RUN poetry install --no-interaction --no-ansi

# Set environment variables
ENV PYTHONPATH=/app

# Command to run the application
CMD ["poetry", "run", "uvicorn", "src.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]