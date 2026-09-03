"""
Administration, user management, and compliance audit trail endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()


class UserInviteRequest(BaseModel):
    name: str
    email: str
    organization: str
    role: str


USERS_DB = [
    {
        "id": "USR-001",
        "name": "Dr. Sarah Kimani",
        "email": "sarah.kimani@demo.trustline.io",
        "organization": "Trustline Risk Governance",
        "role": "admin",
        "status": "active",
        "lastLogin": "2026-03-03T10:15:00Z",
    },
    {
        "id": "USR-002",
        "name": "Dennis Muli",
        "email": "dennis.muli@demo.trustline.io",
        "organization": "Apex Commercial Bank Kenya",
        "role": "risk_manager",
        "status": "active",
        "lastLogin": "2026-03-02T14:30:00Z",
    },
    {
        "id": "USR-003",
        "name": "Grace Wanjiku",
        "email": "grace.wanjiku@demo.trustline.io",
        "organization": "Faida Microfinance Ltd",
        "role": "analyst",
        "status": "active",
        "lastLogin": "2026-03-01T09:00:00Z",
    },
]

AUDIT_LOG_DB = [
    {
        "id": "AUD-1001",
        "timestamp": "2026-03-03T11:45:00Z",
        "user": "Dr. Sarah Kimani",
        "action": "Risk Policy Auto-Approve Boundary Adjusted",
        "entity": "Configuration",
        "entityId": "POL-2026-04",
        "result": "success",
    },
    {
        "id": "AUD-1002",
        "timestamp": "2026-03-03T10:12:00Z",
        "user": "Grace Wanjiku",
        "action": "Underwriting Decision: Approved LN-0004",
        "entity": "Application",
        "entityId": "APP-0004",
        "result": "success",
    },
    {
        "id": "AUD-1003",
        "timestamp": "2026-03-02T16:30:00Z",
        "user": "Dennis Muli",
        "action": "Generated Q1 2026 Sovereign Credit Risk Digest",
        "entity": "Report",
        "entityId": "REP-2026-001",
        "result": "success",
    },
]


@router.get("/users")
async def get_users():
    return USERS_DB


@router.post("/users/invite")
async def invite_user(payload: UserInviteRequest):
    new_user = {
        "id": f"USR-{uuid.uuid4().hex[:3].upper()}",
        "name": payload.name,
        "email": payload.email,
        "organization": payload.organization,
        "role": payload.role,
        "status": "invited",
        "lastLogin": datetime.now().isoformat(),
    }
    USERS_DB.append(new_user)
    return new_user


@router.get("/health")
async def get_system_health():
    return [
        {"name": "XGBoost Real-Time Scoring Microservice", "status": "operational", "latencyMs": 8, "detail": "Sub-10ms response time on CPU"},
        {"name": "SHAP TreeExplainer Attribution Kernel", "status": "operational", "latencyMs": 14, "detail": "C-accelerated tree traversal"},
        {"name": "PostgreSQL Transactional Core", "status": "operational", "latencyMs": 4, "detail": "Connected to pooling gateway"},
        {"name": "Mobile Wallet Telemetry Ingestion Pipeline", "status": "operational", "latencyMs": 22, "detail": "Sync freshness < 1hr"},
        {"name": "Population Stability Drift Telemetry (PSI)", "status": "operational", "latencyMs": 12, "detail": "All feature PSIs < 0.10"},
        {"name": "Vercel CDN Edge Network (React 19 SPA)", "status": "operational", "latencyMs": 18, "detail": "Global latency target met"},
    ]


@router.get("/audit")
async def get_audit_log():
    return AUDIT_LOG_DB
