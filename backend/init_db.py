"""
Database initialization script for the Task Management API.
Creates all necessary tables based on SQLModel definitions.
"""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from sqlmodel import SQLModel
from src.services.database import engine
# Only import the model classes without triggering table creation conflicts
from src.models.task_model import Task, TaskCreate, TaskRead, TaskUpdate, TaskToggle


def create_tables():
    """
    Create all database tables.
    """
    print(f"Creating database tables...")
    print(f"Database URL: {os.getenv('DATABASE_URL', '')[:50]}...")  # Show beginning of URL
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    create_tables()