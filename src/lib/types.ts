/**
 * Trustline domain types.
 *
 * These interfaces mirror the payloads the future FastAPI service will return
 * (see README "FastAPI contract"). The mock API layer in `src/api` returns
 * exactly these shapes so the swap is a one-line change per module.
 */

export type RiskBand = "low" | "medium" | "high" | "severe";

export type Decision = "approved" | "rejected" | "pending" | "referred";

export type UserRole = "admin" | "risk_manager" | "analyst" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  status: "active" | "suspended" | "invited";
  lastLogin: string;
}

export interface TransactionBehaviour {
  monthlyTransactionCount: number;
  averageTransactionAmount: number;
  transactionVolatility: number; // 0-1, higher = less stable
  averageMonthlyInflow: number;
  averageMonthlyOutflow: number;
  averageBalance: number;
  utilisationRatio: number; // 0-1
  monthly: { month: string; inflow: number; outflow: number; count: number; volatility: number }[];
}

export interface RepaymentBehaviour {
  repaymentConsistency: number; // 0-1, higher = better
  previousLoans: number;
  daysPastDueMax: number;
  averageDaysPastDue: number;
  previousDefaults: number;
  onTimeRate: number; // 0-1
}

export interface RepaymentEvent {
  id: string;
  date: string;
  type: "issued" | "due" | "paid" | "late" | "missed" | "completed";
  amount: number;
  loanId: string;
  note: string;
}

export interface Loan {
  id: string;
  borrowerId: string;
  amount: number;
  tenureMonths: number;
  purpose: LoanPurpose;
  issuedAt: string;
  status: "active" | "completed" | "defaulted" | "written_off";
  outstanding: number;
  interestRate: number;
}

export type LoanPurpose =
  | "business_working_capital"
  | "school_fees"
  | "agriculture_inputs"
  | "medical"
  | "asset_purchase"
  | "emergency";

export interface Borrower {
  id: string;
  name: string;
  segment: "salaried" | "micro_business" | "informal_trader" | "smallholder_farmer";
  age: number;
  county: string;
  residenceType: "owned" | "rented" | "family";
  employmentStatus: "employed" | "self_employed" | "casual" | "business_owner";
  dependants: number;
  monthlyIncome: number;
  accountTenureMonths: number;
  activeAccounts: number;
  joinedAt: string;
  riskScore: number;
  probabilityOfDefault: number;
  riskBand: RiskBand;
  activeLoans: number;
  totalBorrowed: number;
  outstandingBalance: number;
  lastAssessment: string;
  transactions: TransactionBehaviour;
  repayment: RepaymentBehaviour;
}

export interface FeatureContribution {
  feature: string;
  label: string;
  value: string;
  contribution: number; // signed; positive pushes PD up (risk-increasing)
  direction: "increases_risk" | "reduces_risk";
  interpretation: string;
}

export interface RiskAssessment {
  id: string;
  borrowerId: string;
  applicationId?: string;
  createdAt: string;
  probabilityOfDefault: number;
  riskScore: number;
  riskBand: RiskBand;
  recommendation: string;
  modelVersion: string;
  contributions: FeatureContribution[];
  confidence: number;
}

export interface Application {
  id: string;
  borrowerId: string;
  borrowerName: string;
  loanId: string;
  amount: number;
  tenureMonths: number;
  purpose: LoanPurpose;
  probabilityOfDefault: number;
  riskScore: number;
  riskBand: RiskBand;
  decision: Decision;
  createdAt: string;
  reviewedBy?: string;
  notes?: string;
}

export interface RiskAssessmentInput {
  age: number;
  monthlyIncome: number;
  employmentStatus: Borrower["employmentStatus"];
  dependants: number;
  residenceType: Borrower["residenceType"];
  loanAmount: number;
  tenureMonths: number;
  purpose: LoanPurpose;
  transactionFrequency: number;
  averageMonthlyInflow: number;
  transactionVolatility: number;
  averageBalance: number;
  utilisationRatio: number;
  repaymentConsistency: number;
  previousLoans: number;
  daysPastDue: number;
  previousDefaults: number;
  accountTenureMonths: number;
  activeAccounts: number;
}

export interface KpiMetric {
  key: string;
  label: string;
  value: string;
  raw: number;
  change: number;
  changeLabel: string;
  intent: "positive" | "negative" | "neutral";
  hint: string;
}

export interface SeriesPoint {
  date: string;
  [key: string]: string | number;
}

export interface DashboardData {
  kpis: KpiMetric[];
  riskBandDistribution: { band: RiskBand; label: string; count: number; exposure: number }[];
  defaultRateOverTime: SeriesPoint[];
  applicationsOverTime: SeriesPoint[];
  approvalVsRejection: SeriesPoint[];
  pdDistribution: { bucket: string; count: number }[];
  exposureByBand: { band: RiskBand; label: string; exposure: number }[];
  highRiskApplications: Application[];
}

export interface PortfolioData {
  kpis: KpiMetric[];
  distribution: { band: RiskBand; label: string; count: number; exposure: number; share: number }[];
  defaultTrend: SeriesPoint[];
  exposureTrend: SeriesPoint[];
  approvalTrend: SeriesPoint[];
  loanSizeDistribution: { bucket: string; count: number; exposure: number }[];
  defaultByPurpose: { purpose: string; defaultRate: number; loans: number }[];
  defaultByBand: { band: string; defaultRate: number; loans: number }[];
  defaultByCohort: { cohort: string; defaultRate: number; borrowers: number }[];
}

export interface AnalyticsData {
  pdDistribution: { bucket: string; count: number }[];
  defaultByUtilisation: { bucket: string; defaultRate: number; borrowers: number }[];
  defaultByRepaymentConsistency: { bucket: string; defaultRate: number; borrowers: number }[];
  defaultByVolatility: { bucket: string; defaultRate: number; borrowers: number }[];
  defaultByTenure: { bucket: string; defaultRate: number; borrowers: number }[];
  defaultByLoanAmount: { bucket: string; defaultRate: number; borrowers: number }[];
  repaymentTrend: SeriesPoint[];
  behaviourScatter: { utilisation: number; pd: number; volatility: number; band: RiskBand }[];
  altDataCoverage: { feature: string; coverage: number; freshness: string }[];
}

export interface Cohort {
  id: string;
  label: string;
  dimension: "quarter" | "month" | "segment" | "purpose" | "band";
  borrowers: number;
  defaultRate: number;
  repaymentRate: number;
  averagePd: number;
  averageLoanSize: number;
  approvalRate: number;
}

export interface ModelMetrics {
  name: string;
  tag: "baseline" | "primary";
  auc: number;
  ks: number;
  precision: number;
  recall: number;
  f1: number;
  calibration: number;
  interpretability: "high" | "medium";
}

export interface ModelIntelligence {
  currentModel: {
    name: string;
    version: string;
    trainedAt: string;
    datasetVersion: string;
    status: "active" | "shadow" | "retired";
    observations: number;
  };
  comparison: ModelMetrics[];
  roc: { fpr: number; tpr: number; baseline: number }[];
  precisionRecall: { recall: number; precision: number }[];
  calibration: { predicted: number; observed: number }[];
  confusionMatrix: { truePositive: number; falsePositive: number; trueNegative: number; falseNegative: number };
  bandPerformance: { band: string; population: number; observedDefaultRate: number; predictedPd: number }[];
  featureImportance: { feature: string; label: string; importance: number; description: string }[];
  monitoring: {
    predictionVolume: SeriesPoint[];
    averagePd: SeriesPoint[];
    scoreDistribution: { bucket: string; count: number }[];
    driftIndicator: { feature: string; psi: number; status: "stable" | "watch" | "drifting" }[];
    featureAvailability: { feature: string; availability: number }[];
    lastEvaluation: string;
  };
}

export interface Report {
  id: string;
  title: string;
  type: "portfolio_risk" | "borrower_risk" | "model_performance" | "default_analysis" | "cohort";
  description: string;
  dateRange: string;
  generatedAt: string;
  status: "ready" | "generating" | "scheduled" | "failed";
  owner: string;
}

export interface ReportDetail extends Report {
  executiveSummary: string[];
  portfolioMetrics: { label: string; value: string; note: string }[];
  riskDistribution: { band: RiskBand; label: string; count: number; exposure: number }[];
  defaultTrends: SeriesPoint[];
  highRiskExposure: { borrowerId: string; name: string; exposure: number; pd: number; band: RiskBand }[];
  modelPerformance: ModelMetrics[];
  keyFindings: string[];
  recommendations: string[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  result: "success" | "failure" | "pending";
}

export interface HealthComponent {
  name: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  detail: string;
}

export interface SearchResults {
  applications: { id: string; label: string; sublabel: string }[];
  borrowers: { id: string; label: string; sublabel: string }[];
  loans: { id: string; borrowerId: string; label: string; sublabel: string }[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
}
