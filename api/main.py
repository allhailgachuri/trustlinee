"""
Trustline Insight — Enterprise FastAPI Scoring & Credit Risk Intelligence Service.

Provides high-throughput credit scoring, portfolio risk aggregation,
and model governance endpoints.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from api.v1.routes import (
    risk,
    applications,
    borrowers,
    portfolio,
    model,
    reports,
    admin,
)

app = FastAPI(
    title="Trustline Insight API",
    description="Alternative-Data Credit Risk Intelligence & Underwriting API for East Africa",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for React Vite SPA and institutional gateways
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response


# Include v1 Routers
app.include_router(risk.router, prefix="/api/v1/risk", tags=["Risk & Scoring Engine"])
app.include_router(applications.router, prefix="/api/v1/applications", tags=["Underwriting Applications"])
app.include_router(borrowers.router, prefix="/api/v1/borrowers", tags=["Borrowers 360"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio & Econometrics"])
app.include_router(model.router, prefix="/api/v1/model", tags=["Model Intelligence & Governance"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Institutional Reports"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Administration & Health"])


@app.get("/", tags=["System"])
async def root():
    return {
        "service": "Trustline Insight API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "jurisdiction": "Kenya (CBK Compliant Alternative Credit Architecture)",
    }


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "scoring_engine": "online",
            "model_registry": "online",
            "data_pipeline": "online",
        },
    }
