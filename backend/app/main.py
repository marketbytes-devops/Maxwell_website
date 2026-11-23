from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import CORS_ORIGINS, UPLOADS_DIR
from app.database import init_db
from app.routers import admin_auth, admin_catalog, ai_extractor, public, upload


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Lazy init on startup, gracefully catch if MySQL is waiting to start
    try:
        init_db()
        print(" [FastAPI] Database initialized successfully.")
    except Exception as exc:
        print(f" [FastAPI] Database init warning (will retry on first request): {exc}")
    yield


app = FastAPI(
    title="Maxwell Commercial Kitchen & Refrigeration API",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local upload directory so uploaded images are directly served
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include API routers
app.include_router(admin_auth.router)
app.include_router(upload.router)
app.include_router(admin_catalog.router)
app.include_router(ai_extractor.router)
app.include_router(public.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "maxsel-fastapi-backend"}


@app.get("/")
def root():
    return {
        "service": "Maxwell Commercial API",
        "docs": "/docs",
        "health": "/health",
    }

