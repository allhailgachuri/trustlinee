"""
Trustline Insight — Synthetic Alternative-Data Generator.

Generates statistically grounded Kenyan credit applicant records using
log-normal cashflow distributions, non-linear delinquency curves, and
mobile money transaction streams in Kenyan Shillings (KES).
"""

import json
import os
import random
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

KENYAN_COUNTIES = [
    "Nairobi", "Mombasa", "Kiambu", "Nakuru", "Kisumu", "Eldoret (Uasin Gishu)",
    "Machakos", "Nyeri", "Meru", "Kajiado", "Kilifi", "Kakamega",
]

FIRST_NAMES = [
    "Samuel", "Mary", "David", "Grace", "Peter", "Faith", "Joseph", "Joyce",
    "John", "Agnes", "Daniel", "Beatrice", "Michael", "Esther", "Stephen", "Mercy",
    "Francis", "Winnie", "George", "Rose", "Paul", "Caroline", "James", "Lilian",
    "Kelvin", "Purity", "Dennis", "Jane", "Brian", "Alice", "Kennedy", "Hellen",
]

LAST_NAMES = [
    "Kipchoge", "Wanjiku", "Ochieng", "Muthoni", "Mwangi", "Achieng", "Kariuki",
    "Wambui", "Kamau", "Otieno", "Njoroge", "Nyambura", "Cheruiyot", "Chebet",
    "Kiplagat", "Mutua", "Ndung'u", "Omondi", "Maina", "Koech", "Karanja",
]

SEGMENT_PROFILES = {
    "salaried": {
        "income_mean": 85000,
        "income_std": 35000,
        "volatility_range": (0.08, 0.22),
        "utilisation_range": (0.35, 0.65),
        "consistency_range": (0.85, 0.99),
        "default_rate_base": 0.035,
    },
    "micro_business": {
        "income_mean": 65000,
        "income_std": 30000,
        "volatility_range": (0.25, 0.45),
        "utilisation_range": (0.45, 0.75),
        "consistency_range": (0.70, 0.92),
        "default_rate_base": 0.075,
    },
    "informal_trader": {
        "income_mean": 45000,
        "income_std": 20000,
        "volatility_range": (0.35, 0.65),
        "utilisation_range": (0.55, 0.85),
        "consistency_range": (0.55, 0.85),
        "default_rate_base": 0.145,
    },
    "smallholder_farmer": {
        "income_mean": 38000,
        "income_std": 18000,
        "volatility_range": (0.45, 0.75),
        "utilisation_range": (0.50, 0.88),
        "consistency_range": (0.50, 0.80),
        "default_rate_base": 0.195,
    },
}

LOAN_PURPOSES = [
    "business_working_capital",
    "school_fees",
    "agriculture_inputs",
    "medical",
    "asset_purchase",
    "emergency",
]


def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(-20.0, min(20.0, x))))


def compute_risk_score_and_pd(
    income: float,
    utilisation: float,
    volatility: float,
    consistency: float,
    dpd_max: int,
    previous_defaults: int,
    account_tenure: int,
) -> tuple[float, int, str]:
    """
    Computes transparent calibrated PD, 300-900 score, and risk band.
    """
    # Logit calculation combining alternative signals
    base_logit = -2.8
    logit = (
        base_logit
        + (utilisation - 0.5) * 3.2
        + (volatility - 0.3) * 2.8
        - (consistency - 0.7) * 4.5
        + (dpd_max / 30.0) * 1.6
        + previous_defaults * 1.8
        - (account_tenure / 48.0) * 0.8
        - (income / 150000.0) * 0.6
    )

    pd = float(sigmoid(logit))

    # Scale PD to 300-900 score: Score = 600 - 50 * ln(odds)
    odds = max(1e-4, min(100.0, pd / max(1e-4, 1.0 - pd)))
    score = int(round(600 - 50 * math.log(odds)))
    score = max(300, min(900, score))

    if pd < 0.05:
        band = "low"
    elif pd < 0.12:
        band = "medium"
    elif pd < 0.25:
        band = "high"
    else:
        band = "severe"

    return round(pd, 4), score, band


def generate_synthetic_records(count: int = 52, seed: int = 42) -> Dict[str, Any]:
    random.seed(seed)
    borrowers = []
    loans = []
    repayments = []
    applications = []

    segments = ["salaried", "micro_business", "informal_trader", "smallholder_farmer"]
    months = [
        "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
        "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
        "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026",
    ]

    for i in range(1, count + 1):
        b_id = f"BW-{i:04d}"
        segment = segments[(i - 1) % len(segments)]
        prof = SEGMENT_PROFILES[segment]

        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        age = random.randint(23, 62)
        county = random.choice(KENYAN_COUNTIES)
        residence = random.choice(["owned", "rented", "family"])
        employment = (
            "employed" if segment == "salaried"
            else "business_owner" if segment == "micro_business"
            else "self_employed" if segment == "informal_trader"
            else "casual"
        )
        dependants = random.randint(0, 5)

        # Statistical income sampling
        income = max(15000, int(random.gauss(prof["income_mean"], prof["income_std"])))
        volatility = round(random.uniform(*prof["volatility_range"]), 2)
        utilisation = round(random.uniform(*prof["utilisation_range"]), 2)
        consistency = round(random.uniform(*prof["consistency_range"]), 2)

        account_tenure = random.randint(12, 96)
        active_accounts = random.randint(1, 4)

        prev_loans = random.randint(1, 8)
        prev_defaults = 1 if (consistency < 0.65 and random.random() > 0.4) else 0
        dpd_max = random.randint(35, 90) if prev_defaults > 0 else (random.randint(5, 25) if consistency < 0.8 else 0)

        pd_val, risk_score, risk_band = compute_risk_score_and_pd(
            income=income,
            utilisation=utilisation,
            volatility=volatility,
            consistency=consistency,
            dpd_max=dpd_max,
            previous_defaults=prev_defaults,
            account_tenure=account_tenure,
        )

        # Monthly cashflows
        monthly_flows = []
        for m in months:
            delta = (random.random() - 0.5) * 2 * volatility
            inflow = round(max(5000, income * (1 + delta)))
            outflow = round(inflow * utilisation * (1 + (random.random() - 0.5) * 0.15))
            cnt = random.randint(15, 80)
            monthly_flows.append({
                "month": m,
                "inflow": inflow,
                "outflow": outflow,
                "count": cnt,
                "volatility": round(volatility * random.uniform(0.85, 1.15), 2),
            })

        active_loans_cnt = random.choice([0, 1, 1, 2])
        outstanding_bal = round(income * 0.6) if active_loans_cnt > 0 else 0

        borrower = {
            "id": b_id,
            "name": name,
            "segment": segment,
            "age": age,
            "county": county,
            "residenceType": residence,
            "employmentStatus": employment,
            "dependants": dependants,
            "monthlyIncome": income,
            "accountTenureMonths": account_tenure,
            "activeAccounts": active_accounts,
            "joinedAt": (datetime.now() - timedelta(days=account_tenure * 30)).isoformat(),
            "riskScore": risk_score,
            "probabilityOfDefault": pd_val,
            "riskBand": risk_band,
            "activeLoans": active_loans_cnt,
            "totalBorrowed": round(income * prev_loans * 0.8),
            "outstandingBalance": outstanding_bal,
            "lastAssessment": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            "transactions": {
                "monthlyTransactionCount": random.randint(25, 90),
                "averageTransactionAmount": round(income / 35),
                "transactionVolatility": volatility,
                "averageMonthlyInflow": income,
                "averageMonthlyOutflow": round(income * utilisation),
                "averageBalance": round(income * (1 - utilisation) * 0.8),
                "utilisationRatio": utilisation,
                "monthly": monthly_flows,
            },
            "repayment": {
                "repaymentConsistency": consistency,
                "previousLoans": prev_loans,
                "daysPastDueMax": dpd_max,
                "averageDaysPastDue": round(dpd_max * 0.4, 1),
                "previousDefaults": prev_defaults,
                "onTimeRate": consistency,
            },
        }
        borrowers.append(borrower)

        # Facilities
        loan_id = f"LN-{i:04d}"
        loan_amt = round(income * random.uniform(0.5, 1.8))
        purpose = random.choice(LOAN_PURPOSES)
        loan_status = (
            "defaulted" if (risk_band == "severe" and random.random() > 0.5)
            else "active" if active_loans_cnt > 0
            else "completed"
        )

        loans.append({
            "id": loan_id,
            "borrowerId": b_id,
            "amount": loan_amt,
            "tenureMonths": random.choice([3, 6, 9, 12]),
            "purpose": purpose,
            "issuedAt": (datetime.now() - timedelta(days=random.randint(30, 200))).isoformat(),
            "status": loan_status,
            "outstanding": outstanding_bal,
            "interestRate": random.choice([0.14, 0.16, 0.18, 0.22]),
        })

        # Application
        app_id = f"APP-{i:04d}"
        decision = (
            "approved" if risk_band == "low"
            else random.choice(["approved", "pending", "referred"]) if risk_band == "medium"
            else random.choice(["referred", "pending", "rejected"]) if risk_band == "high"
            else "rejected"
        )

        applications.append({
            "id": app_id,
            "borrowerId": b_id,
            "borrowerName": name,
            "loanId": loan_id,
            "amount": loan_amt,
            "tenureMonths": random.choice([3, 6, 9, 12]),
            "purpose": purpose,
            "probabilityOfDefault": pd_val,
            "riskScore": risk_score,
            "riskBand": risk_band,
            "decision": decision,
            "createdAt": (datetime.now() - timedelta(days=random.randint(1, 45))).isoformat(),
            "reviewedBy": "Dr. Sarah Kimani" if decision != "pending" else None,
            "notes": "Verified alternative mobile cashflow telemetry." if decision == "approved" else None,
        })

        # Repayments
        for r in range(1, 5):
            is_missed = prev_defaults > 0 and r == 4
            is_late = consistency < 0.75 and random.random() > 0.5
            repayments.append({
                "id": f"REP-{i}-{r}",
                "loanId": loan_id,
                "date": (datetime.now() - timedelta(days=(5 - r) * 30)).isoformat(),
                "type": "missed" if is_missed else ("late" if is_late else "paid"),
                "amount": round(loan_amt / 4),
                "note": "Installment overdue > 30 days" if is_missed else ("Paid via M-Pesa Till" if is_late else "On-time deduction"),
            })

    return {
        "borrowers": borrowers,
        "loans": loans,
        "applications": applications,
        "repayments": repayments,
    }


def main():
    os.makedirs("data", exist_ok=True)
    dataset = generate_synthetic_records(count=52, seed=101)

    with open("data/borrowers_synthetic.json", "w") as f:
        json.dump(dataset["borrowers"], f, indent=2)

    with open("data/loans_synthetic.json", "w") as f:
        json.dump(dataset["loans"], f, indent=2)

    with open("data/applications_synthetic.json", "w") as f:
        json.dump(dataset["applications"], f, indent=2)

    with open("data/repayments_synthetic.json", "w") as f:
        json.dump(dataset["repayments"], f, indent=2)

    # Export flat CSV for tabular modeling & feature engineering
    csv_header = "id,name,segment,age,county,monthlyIncome,utilisationRatio,transactionVolatility,repaymentConsistency,daysPastDueMax,previousDefaults,accountTenureMonths,probabilityOfDefault,riskScore,riskBand\n"
    csv_rows = []
    for b in dataset["borrowers"]:
        csv_rows.append(
            f"{b['id']},\"{b['name']}\",{b['segment']},{b['age']},\"{b['county']}\","
            f"{b['monthlyIncome']},{b['transactions']['utilisationRatio']},{b['transactions']['transactionVolatility']},"
            f"{b['repayment']['repaymentConsistency']},{b['repayment']['daysPastDueMax']},{b['repayment']['previousDefaults']},"
            f"{b['accountTenureMonths']},{b['probabilityOfDefault']},{b['riskScore']},{b['riskBand']}"
        )

    with open("data/borrowers_synthetic.csv", "w") as f:
        f.write(csv_header + "\n".join(csv_rows))

    print(f"[+] Synthetic alternative dataset generated successfully:")
    print(f"  - {len(dataset['borrowers'])} Borrowers (data/borrowers_synthetic.json, data/borrowers_synthetic.csv)")
    print(f"  - {len(dataset['loans'])} Loans (data/loans_synthetic.json)")
    print(f"  - {len(dataset['applications'])} Applications (data/applications_synthetic.json)")
    print(f"  - {len(dataset['repayments'])} Repayments (data/repayments_synthetic.json)")


if __name__ == "__main__":
    main()
