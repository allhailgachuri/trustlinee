import type { Report, ReportDetail } from "@/lib/types";
import { borrowers } from "@/data/dataset";
import { sleep } from "./client";

const INITIAL_REPORTS: Report[] = [
  {
    id: "RPT-2026-001",
    title: "Q1 2026 Comprehensive Portfolio Risk Report",
    type: "portfolio_risk",
    description: "Holistic evaluation of capital exposure, default velocity, and risk migration across all lending segments.",
    dateRange: "Jan 1, 2026 – Mar 31, 2026",
    generatedAt: "2026-03-01T10:15:00Z",
    status: "ready",
    owner: "Dr. Sarah Kimani",
  },
  {
    id: "RPT-2026-002",
    title: "XGBoost v1.4.0 Scorecard Validation Report",
    type: "model_performance",
    description: "Statistical benchmark analysis comparing XGBoost alternative data model against baseline logistic scorecard.",
    dateRange: "Feb 1, 2026 – Feb 28, 2026",
    generatedAt: "2026-03-02T14:40:00Z",
    status: "ready",
    owner: "Risk Analytics Team",
  },
  {
    id: "RPT-2026-003",
    title: "Informal Trader Segment Delinquency Deep Dive",
    type: "default_analysis",
    description: "Granular investigation of volatility and cash-flow shock drivers among informal retail merchants.",
    dateRange: "Dec 1, 2025 – Feb 28, 2026",
    generatedAt: "2026-03-02T16:20:00Z",
    status: "ready",
    owner: "Senior Credit Committee",
  },
  {
    id: "RPT-2026-004",
    title: "High-Risk Exposure & Watchlist Audit",
    type: "borrower_risk",
    description: "Individual borrower breakdown for all active facilities classified in High and Severe risk tiers.",
    dateRange: "Last 30 Days",
    generatedAt: "2026-03-03T08:00:00Z",
    status: "ready",
    owner: "Dr. Sarah Kimani",
  },
  {
    id: "RPT-2026-005",
    title: "2025 Cohort Maturity & Loss Given Default (LGD)",
    type: "cohort",
    description: "12-month vintage curve analysis demonstrating loss stabilization after mobile score integration.",
    dateRange: "Jan 1, 2025 – Dec 31, 2025",
    generatedAt: "2026-02-20T11:00:00Z",
    status: "ready",
    owner: "Portfolio Management",
  },
];

let reportStore = [...INITIAL_REPORTS];

export const reportsApi = {
  async getReports(): Promise<Report[]> {
    await sleep(150);
    return [...reportStore];
  },

  async getReportById(id: string): Promise<ReportDetail | null> {
    await sleep(200);
    const report = reportStore.find((r) => r.id === id) || reportStore[0]!;

    const highRiskBorrowers = borrowers
      .filter((b) => b.riskBand === "high" || b.riskBand === "severe")
      .map((b) => ({
        borrowerId: b.id,
        name: b.name,
        exposure: b.outstandingBalance || 45_000,
        pd: b.probabilityOfDefault,
        band: b.riskBand,
      }));

    return {
      ...report,
      executiveSummary: [
        "Portfolio overall credit health remains strong with a weighted average Probability of Default (PD) of 5.7%, outperforming the target threshold of 6.5%.",
        "Alternative data feature integration (primarily Mobile Inflow Consistency and Transaction Volatility) yielded a 34% reduction in false-positive credit rejections.",
        "Total monitored active principal stands at KES 7.9M with 54% of exposure situated in the Low Risk band.",
        "Delinquency concentration is tightly isolated to informal traders experiencing seasonal agricultural cash flow volatility in western regions.",
      ],
      portfolioMetrics: [
        { label: "Active Monitored Exposure", value: "KES 7.9M", note: "+14.2% QoQ" },
        { label: "Portfolio Mean PD", value: "5.7%", note: "-1.1pp lower risk" },
        { label: "Observed 90+ DPD Default", value: "3.9%", note: "Well within 5.0% risk appetite" },
        { label: "Model Approval Rate", value: "81.4%", note: "High underwriting efficiency" },
      ],
      riskDistribution: [
        { band: "low", label: "Low Risk", count: 20, exposure: 4_250_000 },
        { band: "medium", label: "Medium Risk", count: 16, exposure: 2_150_000 },
        { band: "high", label: "High Risk", count: 10, exposure: 1_120_000 },
        { band: "severe", label: "Very High Risk", count: 6, exposure: 380_000 },
      ],
      defaultTrends: [
        { date: "Oct 25", observed: 4.8, baseline: 5.4 },
        { date: "Nov 25", observed: 4.6, baseline: 5.6 },
        { date: "Dec 25", observed: 5.1, baseline: 5.9 },
        { date: "Jan 26", observed: 4.5, baseline: 5.8 },
        { date: "Feb 26", observed: 4.2, baseline: 5.5 },
        { date: "Mar 26", observed: 3.9, baseline: 5.3 },
      ],
      highRiskExposure: highRiskBorrowers,
      modelPerformance: [
        {
          name: "XGBoost Primary Scorecard",
          tag: "primary",
          auc: 0.884,
          ks: 54.2,
          precision: 0.812,
          recall: 0.776,
          f1: 0.793,
          calibration: 0.042,
          interpretability: "high",
        },
      ],
      keyFindings: [
        "Borrowers with mobile account tenure over 24 months demonstrate 4.2x higher repayment consistency regardless of formal income verification.",
        "Cash flow utilization above 75% serves as an early leading warning indicator 45 days prior to first missed instalment.",
        "SHAP feature contribution transparency reduced manual review turnaround from 24 hours to 42 minutes.",
      ],
      recommendations: [
        "Maintain existing risk band thresholds (Low <= 5%, Med <= 12%, High <= 25%).",
        "Introduce dynamic repayment reminders triggered when a borrower's 7-day mobile inflow volatility spikes by > 30%.",
        "Expand smallholder farmer alternative data ingestion to include regional satellite rainfall indices.",
      ],
    };
  },

  async generateReport(type: Report["type"], title: string, dateRange: string): Promise<Report> {
    await sleep(400);

    const newReport: Report = {
      id: `RPT-2026-${String(reportStore.length + 1).padStart(3, "0")}`,
      title,
      type,
      description: `Custom ${type.replace(/_/g, " ")} generated by underwriter request.`,
      dateRange,
      generatedAt: new Date().toISOString(),
      status: "ready",
      owner: "Dr. Sarah Kimani",
    };

    reportStore.unshift(newReport);
    return newReport;
  },
};
