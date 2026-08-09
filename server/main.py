from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions (e.g. database connections, client initializations) can be put here
    yield
    # Shutdown actions (e.g. closing database connections) can be put here

app = FastAPI(
    title="auraMax API",
    description="Backend API for auraMax AI Beauty & Fashion Consultant",
    version="1.0.0",
    lifespan=lifespan
)

# ── CORS MIDDLEWARE ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allowing all origins as requested
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTER MOUNTING ───────────────────────────────────────────────────────────
app.include_router(api_router, prefix="/api/v1")

# ── HEALTH CHECK ROUTE ────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {"status": "auraMax API is running"}
