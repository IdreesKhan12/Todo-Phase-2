from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import text, inspect
from ..config.settings import settings
from typing import Generator


# Create the database engine with the Neon database URL
connect_args = {}
if settings.database_url.startswith("postgresql"):
    connect_args = {"sslmode": "require"}

engine = create_engine(
    settings.database_url,
    echo=True,
    connect_args=connect_args
)


def create_db_and_tables():
    """Create all database tables and run migrations."""
    SQLModel.metadata.create_all(engine)
    _run_migrations()


def _run_migrations():
    """Add missing columns to existing tables."""
    inspector = inspect(engine)
    if inspector.has_table("task"):
        columns = [col["name"] for col in inspector.get_columns("task")]
        if "due_date" not in columns:
            with engine.begin() as conn:
                conn.execute(text("ALTER TABLE task ADD COLUMN due_date VARCHAR"))


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for dependency injection in FastAPI.
    """
    with Session(engine) as session:
        yield session