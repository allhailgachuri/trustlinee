"""
Borrowers directory and 360-degree credit profile endpoints.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Any, Dict
from pydantic import BaseModel
import json
import os

from scripts.schemas import BorrowerSchema, LoanSchema, RepaymentEventSchema

router = APIRouter()


class BorrowersListResponse(BaseModel):
    items: List[BorrowerSchema]
    total: int
    page: int
    pageSize: int
    totalPages: int


class BorrowerDetailResponse(BaseModel):
    borrower: BorrowerSchema
    loans: List[LoanSchema]
    repayments: List[RepaymentEventSchema]
    latestAssessment: Optional[Dict[str, Any]] = None


def load_data(filename: str) -> List[dict]:
    path = os.path.join("data", filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []


@router.get("", response_model=BorrowersListResponse)
async def list_borrowers(
    search: Optional[str] = Query(""),
    segment: Optional[str] = Query("all"),
    riskBand: Optional[str] = Query("all"),
    page: int = Query(1, ge=1),
    pageSize: int = Query(10, ge=1, le=100),
    sortBy: str = Query("riskScore"),
    sortOrder: str = Query("desc"),
):
    borrowers = load_data("borrowers_synthetic.json")

    filtered = []
    for b in borrowers:
        if segment != "all" and b.get("segment") != segment:
            continue
        if riskBand != "all" and b.get("riskBand") != riskBand:
            continue
        if search:
            q = search.lower()
            if (
                q not in b.get("id", "").lower()
                and q not in b.get("name", "").lower()
                and q not in b.get("county", "").lower()
            ):
                continue
        filtered.append(b)

    reverse = sortOrder.lower() == "desc"
    filtered.sort(key=lambda x: x.get(sortBy, 0), reverse=reverse)

    total = len(filtered)
    total_pages = max(1, (total + pageSize - 1) // pageSize)
    start_idx = (page - 1) * pageSize
    page_items = filtered[start_idx : start_idx + pageSize]

    return BorrowersListResponse(
        items=[BorrowerSchema(**item) for item in page_items],
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=total_pages,
    )


@router.get("/{borrower_id}", response_model=BorrowerDetailResponse)
async def get_borrower_360(borrower_id: str):
    borrowers = load_data("borrowers_synthetic.json")
    loans = load_data("loans_synthetic.json")
    repayments = load_data("repayments_synthetic.json")

    target_borrower = next((b for b in borrowers if b.get("id") == borrower_id), None)
    if not target_borrower:
        raise HTTPException(status_code=404, detail=f"Borrower {borrower_id} not found")

    user_loans = [LoanSchema(**l) for l in loans if l.get("borrowerId") == borrower_id]
    user_loan_ids = {l.id for l in user_loans}
    user_repayments = [
        RepaymentEventSchema(**r) for r in repayments if r.get("loanId") in user_loan_ids
    ]

    return BorrowerDetailResponse(
        borrower=BorrowerSchema(**target_borrower),
        loans=user_loans,
        repayments=user_repayments,
        latestAssessment={
            "score": target_borrower.get("riskScore"),
            "pd": target_borrower.get("probabilityOfDefault"),
            "band": target_borrower.get("riskBand"),
            "evaluatedAt": target_borrower.get("lastAssessment"),
        },
    )
