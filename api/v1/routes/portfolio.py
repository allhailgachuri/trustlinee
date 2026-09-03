"""
Portfolio risk, capital exposure distribution, and econometrics endpoints.
"""

from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel
import json
import os

router = APIRouter()


def load_data(filename: str) -> List[dict]:
    path = os.path.join("data", filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []


@router.get("/summary")
async def get_portfolio_summary():
    borrowers = load_data("borrowers_synthetic.json")
    loans = load_data("loans_synthetic.json")

    total_borrowers = len(borrowers)
    active_loans = [l for l in loans if l.get("status") == "active"]
    total_exposure = sum(l.get("amount", 0) for l in active_loans)
    outstanding_bal = sum(l.get("outstanding", 0) for l in active_loans)
    defaulted_loans = [l for l in loans if l.get("status") == "defaulted"]

    avg_pd = (
        sum(b.get("probabilityOfDefault", 0) for b in borrowers) / max(1, total_borrowers)
    )
    default_rate = len(defaulted_loans) / max(1, len(loans))

    # Risk band distribution
    band_counts = {"low": 0, "medium": 0, "high": 0, "severe": 0}
    band_exposure = {"low": 0.0, "medium": 0.0, "high": 0.0, "severe": 0.0}

    for b in borrowers:
        band = b.get("riskBand", "medium")
        band_counts[band] = band_counts.get(band, 0) + 1
        band_exposure[band] = band_exposure.get(band, 0.0) + b.get("outstandingBalance", 0.0)

    distribution = [
        {
            "band": k,
            "label": f"{k.title()} Risk",
            "count": band_counts[k],
            "exposure": band_exposure[k],
            "share": round(band_counts[k] / max(1, total_borrowers), 3),
        }
        for k in ["low", "medium", "high", "severe"]
    ]

    return {
        "kpis": [
            {
                "key": "total_borrowers",
                "label": "Total Active Borrowers",
                "value": f"{total_borrowers:,}",
                "raw": total_borrowers,
                "change": 8.4,
                "changeLabel": "+8.4% MoM",
                "intent": "positive",
                "hint": "Number of unique verified borrowers with active profiles.",
            },
            {
                "key": "total_exposure",
                "label": "Total Active Exposure",
                "value": f"KES {total_exposure:,.0f}",
                "raw": total_exposure,
                "change": 14.2,
                "changeLabel": "+14.2% MoM",
                "intent": "positive",
                "hint": "Total principal committed across active facilities.",
            },
            {
                "key": "default_rate",
                "label": "Portfolio Default Rate",
                "value": f"{default_rate * 100:.1f}%",
                "raw": default_rate,
                "change": -0.6,
                "changeLabel": "-0.6% vs benchmark",
                "intent": "positive",
                "hint": "Observed 90+ DPD defaults over total originated loans.",
            },
            {
                "key": "avg_pd",
                "label": "Portfolio Mean PD",
                "value": f"{avg_pd * 100:.1f}%",
                "raw": avg_pd,
                "change": -0.4,
                "changeLabel": "Stable",
                "intent": "positive",
                "hint": "Calibrated probability of default across the loan book.",
            },
        ],
        "distribution": distribution,
        "defaultTrend": [
            {"date": "Q1 2025", "rate": 0.048, "benchmark": 0.065},
            {"date": "Q2 2025", "rate": 0.044, "benchmark": 0.064},
            {"date": "Q3 2025", "rate": 0.041, "benchmark": 0.062},
            {"date": "Q4 2025", "rate": 0.038, "benchmark": 0.060},
            {"date": "Q1 2026", "rate": 0.035, "benchmark": 0.058},
        ],
        "defaultByPurpose": [
            {"purpose": "Working Capital", "defaultRate": 0.038, "loans": 24},
            {"purpose": "Agriculture Inputs", "defaultRate": 0.082, "loans": 12},
            {"purpose": "Asset Purchase", "defaultRate": 0.029, "loans": 8},
            {"purpose": "School Fees", "defaultRate": 0.045, "loans": 5},
            {"purpose": "Emergency / Medical", "defaultRate": 0.095, "loans": 3},
        ],
    }
