from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import tasks
from .routes import auth
from ..config.settings import settings
from ..services.database import create_db_and_tables
from ..models.task_model import Task  # noqa: F401 - ensure model is registered
from ..models.user_model import User  # noqa: F401 - ensure model is registered


def create_app() -> FastAPI:
    app = FastAPI(
        title="Task Management API",
        description="A REST API for managing user tasks",
        version="1.0.0",
        debug=settings.debug
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000","https://idrees-khan-full-stack-todo.hf.space"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup():
        create_db_and_tables()

    # Include routers
    app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])
    app.include_router(auth.router, prefix="/auth", tags=["auth"])

    @app.get("/")
    def read_root():
        return {"message": "Task Management API is running!"}

    return app


app = create_app()