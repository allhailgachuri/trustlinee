"""
Underwriting applications management routes.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Literal
from pydantic import BaseModel
import json
import os

from scripts.schemas import ApplicationSchema, Decision, RiskBand

router = APIRouter()


class DecisionUpdateRequest(BaseModel):
    decision: Decision
    reviewedBy: Optional[str] = "Dr. Sarah Kimani"
    notes: Optional[str] = None


class ApplicationsListResponse(BaseModel):
    items: List[ApplicationSchema]
    total: int
    page: int
    pageSize: int
    totalPages: int


def load_applications() -> List[dict]:
    data_path = "data/applications_synthetic.json"
    if os.path.exists(data_path):
        with open(data_path, "r") as f:
            return json.load(f)
    return []


@router.get("", response_model=ApplicationsListResponse)
async def list_applications(
    status: Optional[str] = Query("all"),
    riskBand: Optional[str] = Query("all"),
    search: Optional[str] = Query(""),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    sortBy: str = Query("createdAt"),
    sortOrder: str = Query("desc"),
):
    apps = load_applications()

    # Filter
    filtered = []
    for a in apps:
        if status != "all" and a.get("decision") != status:
            continue
        if riskBand != "all" and a.get("riskBand") != riskBand:
            continue
        if search:
            q = search.lower()
            if (
                q not in a.get("id", "").lower()
                and q not in a.get("borrowerName", "").lower()
                and q not in a.get("borrowerId", "").lower()
            ):
                continue
        filtered.append(a)

    # Sort
    reverse = sortOrder.lower() == "desc"
    filtered.sort(key=lambda x: x.get(sortBy, ""), reverse=reverse)

    total = len(filtered)
    total_pages = max(1, (total + pageSize - 1) // pageSize)
    start_idx = (page - 1) * pageSize
    page_items = filtered[start_idx : start_idx + pageSize]

    return ApplicationsListResponse(
        items=[ApplicationSchema(**item) for item in page_items],
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=total_pages,
    )


@router.get("/{app_id}", response_model=ApplicationSchema)
async def get_application(app_id: str):
    apps = load_applications()
    for a in apps:
        if a.get("id") == app_id:
            return ApplicationSchema(**a)
    raise HTTPException(status_code=404, detail=f"Application {app_id} not found")


@router.post("/{app_id}/decision", response_model=ApplicationSchema)
async def update_decision(app_id: str, payload: DecisionUpdateRequest):
    apps = load_applications()
    for a in apps:
        if a.get("id") == app_id:
            a["decision"] = payload.decision
            a["reviewedBy"] = payload.reviewedBy
            a["notes"] = payload.notes

            # Persist update
            with open("data/applications_synthetic.json", "w") as f:
                json.dump(apps, f, indent=2)

            return ApplicationSchema(**a)
    raise HTTPException(status_code=404, detail=f"Application {app_id} not found")
