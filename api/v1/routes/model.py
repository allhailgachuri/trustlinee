"""
Model intelligence, benchmark comparisons, ROC curves, and drift telemetry.
"""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.get("/intelligence")
async def get_model_intelligence() -> Dict[str, Any]:
    return {
        "currentModel": {
            "name": "XGBoost Calibrated Scorecard",
            "version": "v1.4.0",
            "trainedAt": "2026-02-15T00:00:00Z",
            "datasetVersion": "ke-alt-data-2026q1",
            "status": "active",
            "observations": 52000,
        },
        "comparison": [
            {
                "name": "XGBoost Primary (TreeExplainer)",
                "tag": "primary",
                "auc": 0.884,
                "ks": 54.2,
                "precision": 0.824,
                "recall": 0.791,
                "f1": 0.807,
                "calibration": 0.041,
                "interpretability": "high",
            },
            {
                "name": "Logistic Scorecard (WoE Baseline)",
                "tag": "baseline",
                "auc": 0.768,
                "ks": 38.6,
                "precision": 0.712,
                "recall": 0.685,
                "f1": 0.698,
                "calibration": 0.078,
                "interpretability": "high",
            },
        ],
        "roc": [
            {"fpr": 0.0, "tpr": 0.0, "baseline": 0.0},
            {"fpr": 0.05, "tpr": 0.42, "baseline": 0.28},
            {"fpr": 0.10, "tpr": 0.68, "baseline": 0.48},
            {"fpr": 0.20, "tpr": 0.82, "baseline": 0.64},
            {"fpr": 0.30, "tpr": 0.89, "baseline": 0.74},
            {"fpr": 0.50, "tpr": 0.95, "baseline": 0.85},
            {"fpr": 0.70, "tpr": 0.98, "baseline": 0.92},
            {"fpr": 1.0, "tpr": 1.0, "baseline": 1.0},
        ],
        "calibration": [
            {"predicted": 2.5, "observed": 2.4},
            {"predicted": 5.0, "observed": 4.9},
            {"predicted": 10.0, "observed": 10.2},
            {"predicted": 15.0, "observed": 14.8},
            {"predicted": 20.0, "observed": 20.4},
            {"predicted": 30.0, "observed": 29.5},
            {"predicted": 40.0, "observed": 41.1},
        ],
        "featureImportance": [
            {
                "feature": "repaymentConsistency",
                "label": "Repayment Consistency",
                "importance": 0.28,
                "description": "Historical on-time installment completion rate over trailing 12 months.",
            },
            {
                "feature": "utilisationRatio",
                "label": "Cashflow Utilisation",
                "importance": 0.22,
                "description": "Ratio of total monthly outflows and commitments to verified inflows.",
            },
            {
                "feature": "transactionVolatility",
                "label": "Transaction Volatility",
                "importance": 0.18,
                "description": "Weekly standard deviation of mobile wallet cashflow movements.",
            },
            {
                "feature": "daysPastDue",
                "label": "Days Past Due (Max DPD)",
                "importance": 0.15,
                "description": "Longest delinquency duration on historical credit facilities.",
            },
            {
                "feature": "accountTenureMonths",
                "label": "Account Tenure",
                "importance": 0.11,
                "description": "Duration of verified continuous digital wallet statements.",
            },
            {
                "feature": "monthlyIncome",
                "label": "Monthly Income Level",
                "importance": 0.06,
                "description": "Baseline absolute monthly earning capacity in KES.",
            },
        ],
        "monitoring": {
            "driftIndicator": [
                {"feature": "utilisationRatio", "psi": 0.038, "status": "stable"},
                {"feature": "repaymentConsistency", "psi": 0.042, "status": "stable"},
                {"feature": "transactionVolatility", "psi": 0.088, "status": "stable"},
                {"feature": "accountTenureMonths", "psi": 0.021, "status": "stable"},
            ],
            "lastEvaluation": "2026-03-01T00:00:00Z",
        },
    }
