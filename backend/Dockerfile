# Use Python 3.10 base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy only the files needed for poetry install first
COPY pyproject.toml poetry.lock README.md ./

# Configure poetry to not create a virtual environment inside the container
RUN poetry config virtualenvs.create false

# Install dependencies without the root package
RUN poetry install --no-interaction --no-ansi --no-root

# Now copy the rest of the application
COPY . .

# Install the root package
RUN poetry install --no-interaction --no-ansi

# Make sure scripts are executable
RUN chmod +x /app/src/manage.py

# Set environment variables
ENV PYTHONPATH=/app
ENV PATH="/app:${PATH}"

# Command to run the application
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]