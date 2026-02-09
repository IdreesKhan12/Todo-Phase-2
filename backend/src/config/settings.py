import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "sqlite:///./test.db")
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        self.better_auth_secret = os.getenv("BETTER_AUTH_SECRET", "")


settings = Settings()