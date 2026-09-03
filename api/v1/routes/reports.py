"""
Institutional reports endpoints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()


class GenerateReportRequest(BaseModel):
    type: str
    title: str
    dateRange: str


REPORTS_DB = [
    {
        "id": "REP-2026-001",
        "title": "Q1 2026 Sovereign Credit Risk & Alternative Underwriting Digest",
        "type": "portfolio_risk",
        "description": "Executive overview of credit loss vintages, alternative data coverage in East Africa, and model calibration stability.",
        "dateRange": "Jan 1, 2026 – Mar 31, 2026",
        "generatedAt": "2026-03-01T10:00:00Z",
        "status": "ready",
        "owner": "Dr. Sarah Kimani",
        "executiveSummary": [
            "The active digital loan book expanded by 14.2% MoM to KES 4,820,000 across 52 audited facilities with zero systemic capital stress.",
            "Calibrated XGBoost Model v1.4.0 maintained an AUC of 0.884 and KS statistic of 54.2, outperforming the baseline scorecard by +11.6 AUC points.",
            "Alternative mobile cashflow signals compressed portfolio default rates to 3.5%, well below the regional market benchmark of 5.8%.",
        ],
        "portfolioMetrics": [
            {"label": "Active Facilities", "value": "52", "note": "+8.4% QoQ"},
            {"label": "Total Principal Committed", "value": "KES 4,820,000", "note": "Fully performing"},
            {"label": "Observed Default Rate", "value": "3.5%", "note": "-2.3% vs benchmark"},
            {"label": "Mean Model PD", "value": "6.8%", "note": "Calibrated Tier-1"},
        ],
        "highRiskExposure": [
            {"borrowerId": "BW-0012", "name": "Daniel Kamau", "exposure": 85000, "pd": 0.284, "band": "severe"},
            {"borrowerId": "BW-0027", "name": "Mercy Chebet", "exposure": 65000, "pd": 0.221, "band": "high"},
            {"borrowerId": "BW-0044", "name": "Eunice Omondi", "exposure": 72000, "pd": 0.198, "band": "high"},
        ],
        "keyFindings": [
            "Cashflow utilisation above 65% serves as the strongest early-warning trigger for installment delinquency.",
            "Smallholder farmers exhibit high seasonal resilience when repayment schedules are amortized to quarterly harvest cycles.",
            "Digital wallet transaction volatility has remained stable with a Population Stability Index (PSI) of 0.088.",
        ],
        "recommendations": [
            "Maintain current fast-track auto-approval threshold at PD <= 3.5% for salaried and low-volatility MSME borrowers.",
            "Require secondary utility verification on applicants with utilization between 55% and 75%.",
            "Expand seasonal repayment flex facilities for agricultural smallholders in Western Kenya.",
        ],
    },
]


@router.get("")
async def get_reports():
    return REPORTS_DB


@router.get("/{report_id}")
async def get_report_detail(report_id: str):
    rep = next((r for r in REPORTS_DB if r["id"] == report_id), None)
    if not rep:
        raise HTTPException(status_code=404, detail=f"Report {report_id} not found")
    return rep


@router.post("/generate")
async def generate_report(payload: GenerateReportRequest):
    new_report = {
        "id": f"REP-2026-{uuid.uuid4().hex[:3].upper()}",
        "title": payload.title,
        "type": payload.type,
        "description": f"Generated institutional risk analysis report covering {payload.dateRange}.",
        "dateRange": payload.dateRange,
        "generatedAt": datetime.now().isoformat(),
        "status": "ready",
        "owner": "Dr. Sarah Kimani",
        "executiveSummary": [
            f"Automated risk synthesis report compiled across {payload.dateRange}.",
            "All model evaluation metrics and portfolio segment loss distributions validated.",
        ],
        "portfolioMetrics": [
            {"label": "Portfolio Status", "value": "Healthy", "note": "No material drift"},
            {"label": "Model Engine", "value": "XGBoost v1.4.0", "note": "Active"},
        ],
        "highRiskExposure": [],
        "keyFindings": ["Continuous feature stability observed across all segments."],
        "recommendations": ["Adhere to established risk policy boundaries."],
    }
    REPORTS_DB.insert(0, new_report)
    return new_report
