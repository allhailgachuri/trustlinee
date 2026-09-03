"""
Trustline Insight — Domain Validation Schemas (Pydantic v2).

Defines the exact JSON payload contracts for the FastAPI inference microservice,
data ingestion pipeline, and machine learning training datasets.
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


RiskBand = Literal["low", "medium", "high", "severe"]
Decision = Literal["approved", "rejected", "pending", "referred"]
UserRole = Literal["admin", "risk_manager", "analyst", "viewer"]
SegmentType = Literal["salaried", "micro_business", "informal_trader", "smallholder_farmer"]
ResidenceType = Literal["owned", "rented", "family"]
EmploymentStatus = Literal["employed", "self_employed", "casual", "business_owner"]
LoanPurpose = Literal[
    "business_working_capital",
    "school_fees",
    "agriculture_inputs",
    "medical",
    "asset_purchase",
    "emergency",
]


class MonthlyCashflow(BaseModel):
    month: str
    inflow: float
    outflow: float
    count: int
    volatility: float


class TransactionBehaviourSchema(BaseModel):
    monthly_transaction_count: int = Field(..., alias="monthlyTransactionCount")
    average_transaction_amount: float = Field(..., alias="averageTransactionAmount")
    transaction_volatility: float = Field(..., ge=0.0, le=1.0, alias="transactionVolatility")
    average_monthly_inflow: float = Field(..., ge=0.0, alias="averageMonthlyInflow")
    average_monthly_outflow: float = Field(..., ge=0.0, alias="averageMonthlyOutflow")
    average_balance: float = Field(..., alias="averageBalance")
    utilisation_ratio: float = Field(..., ge=0.0, le=1.5, alias="utilisationRatio")
    monthly: List[MonthlyCashflow] = []


class RepaymentBehaviourSchema(BaseModel):
    repayment_consistency: float = Field(..., ge=0.0, le=1.0, alias="repaymentConsistency")
    previous_loans: int = Field(..., ge=0, alias="previousLoans")
    days_past_due_max: int = Field(..., ge=0, alias="daysPastDueMax")
    average_days_past_due: float = Field(..., ge=0.0, alias="averageDaysPastDue")
    previous_defaults: int = Field(..., ge=0, alias="previousDefaults")
    on_time_rate: float = Field(..., ge=0.0, le=1.0, alias="onTimeRate")


class BorrowerSchema(BaseModel):
    id: str
    name: str
    segment: SegmentType
    age: int = Field(..., ge=18, le=100)
    county: str
    residence_type: ResidenceType = Field(..., alias="residenceType")
    employment_status: EmploymentStatus = Field(..., alias="employmentStatus")
    dependants: int = Field(..., ge=0)
    monthly_income: float = Field(..., ge=0.0, alias="monthlyIncome")
    account_tenure_months: int = Field(..., ge=0, alias="accountTenureMonths")
    active_accounts: int = Field(..., ge=1, alias="activeAccounts")
    joined_at: str = Field(..., alias="joinedAt")
    risk_score: int = Field(..., ge=300, le=900, alias="riskScore")
    probability_of_default: float = Field(..., ge=0.0, le=1.0, alias="probabilityOfDefault")
    risk_band: RiskBand = Field(..., alias="riskBand")
    active_loans: int = Field(..., ge=0, alias="activeLoans")
    total_borrowed: float = Field(..., ge=0.0, alias="totalBorrowed")
    outstanding_balance: float = Field(..., ge=0.0, alias="outstandingBalance")
    last_assessment: str = Field(..., alias="lastAssessment")
    transactions: TransactionBehaviourSchema
    repayment: RepaymentBehaviourSchema


class LoanSchema(BaseModel):
    id: str
    borrower_id: str = Field(..., alias="borrowerId")
    amount: float = Field(..., gt=0.0)
    tenure_months: int = Field(..., ge=1, le=60, alias="tenureMonths")
    purpose: LoanPurpose
    issued_at: str = Field(..., alias="issuedAt")
    status: Literal["active", "completed", "defaulted", "written_off"]
    outstanding: float = Field(..., ge=0.0)
    interest_rate: float = Field(..., ge=0.0, le=1.0, alias="interestRate")


class RepaymentEventSchema(BaseModel):
    id: str
    loan_id: str = Field(..., alias="loanId")
    date: str
    type: Literal["issued", "due", "paid", "late", "missed", "completed"]
    amount: float = Field(..., ge=0.0)
    note: str


class ApplicationSchema(BaseModel):
    id: str
    borrower_id: str = Field(..., alias="borrowerId")
    borrower_name: str = Field(..., alias="borrowerName")
    loan_id: str = Field(..., alias="loanId")
    amount: float = Field(..., gt=0.0)
    tenure_months: int = Field(..., ge=1, le=60, alias="tenureMonths")
    purpose: LoanPurpose
    probability_of_default: float = Field(..., ge=0.0, le=1.0, alias="probabilityOfDefault")
    risk_score: int = Field(..., ge=300, le=900, alias="riskScore")
    risk_band: RiskBand = Field(..., alias="riskBand")
    decision: Decision
    created_at: str = Field(..., alias="createdAt")
    reviewed_by: Optional[str] = Field(None, alias="reviewedBy")
    notes: Optional[str] = None


class FeatureContributionSchema(BaseModel):
    feature: str
    label: str
    value: str
    contribution: float
    direction: Literal["increases_risk", "reduces_risk"]
    interpretation: str


class RiskAssessmentRequest(BaseModel):
    age: int = Field(..., ge=18, le=100)
    monthly_income: float = Field(..., ge=0.0, alias="monthlyIncome")
    employment_status: EmploymentStatus = Field(..., alias="employmentStatus")
    dependants: int = Field(..., ge=0)
    residence_type: ResidenceType = Field(..., alias="residenceType")
    loan_amount: float = Field(..., gt=0.0, alias="loanAmount")
    tenure_months: int = Field(..., ge=1, le=60, alias="tenureMonths")
    purpose: LoanPurpose
    transaction_frequency: int = Field(..., ge=0, alias="transactionFrequency")
    average_monthly_inflow: float = Field(..., ge=0.0, alias="averageMonthlyInflow")
    transaction_volatility: float = Field(..., ge=0.0, le=1.0, alias="transactionVolatility")
    average_balance: float = Field(..., alias="averageBalance")
    utilisation_ratio: float = Field(..., ge=0.0, le=1.5, alias="utilisationRatio")
    repayment_consistency: float = Field(..., ge=0.0, le=1.0, alias="repaymentConsistency")
    previous_loans: int = Field(..., ge=0, alias="previousLoans")
    days_past_due: int = Field(..., ge=0, alias="daysPastDue")
    previous_defaults: int = Field(..., ge=0, alias="previousDefaults")
    account_tenure_months: int = Field(..., ge=0, alias="accountTenureMonths")
    active_accounts: int = Field(..., ge=1, alias="activeAccounts")


class RiskAssessmentResponse(BaseModel):
    id: str
    borrower_id: Optional[str] = Field(None, alias="borrowerId")
    application_id: Optional[str] = Field(None, alias="applicationId")
    created_at: str = Field(..., alias="createdAt")
    probability_of_default: float = Field(..., alias="probabilityOfDefault")
    risk_score: int = Field(..., alias="riskScore")
    risk_band: RiskBand = Field(..., alias="riskBand")
    recommendation: str
    model_version: str = Field(..., alias="modelVersion")
    contributions: List[FeatureContributionSchema]
    confidence: float
