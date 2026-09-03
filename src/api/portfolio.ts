import type { KpiMetric, PortfolioData, SeriesPoint } from "@/lib/types";
import { borrowers, loans } from "@/data/dataset";
import { KES, pct } from "@/lib/format";
import { sleep } from "./client";

export const portfolioApi = {
  async getPortfolioData(): Promise<PortfolioData> {
    await sleep(200);

    const totalBorrowers = borrowers.length;
    const activeLoans = loans.filter((l) => l.status === "active").length;
    const totalExposure = loans
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + l.amount, 0);
    const outstandingBalance = loans
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + l.outstanding, 0);
    const avgPd =
      borrowers.reduce((sum, b) => sum + b.probabilityOfDefault, 0) / Math.max(1, borrowers.length);
    const defaultedLoans = loans.filter((l) => l.status === "defaulted").length;
    const defaultRate = defaultedLoans / Math.max(1, loans.length);

    const highRiskLoans = loans.filter((l) => {
      const b = borrowers.find((bor) => bor.id === l.borrowerId);
      return b?.riskBand === "high" || b?.riskBand === "severe";
    });
    const highRiskExposure = highRiskLoans.reduce((sum, l) => sum + l.outstanding, 0);

    const kpis: KpiMetric[] = [
      {
        key: "total_borrowers",
        label: "Total Borrowers",
        value: totalBorrowers.toString(),
        raw: totalBorrowers,
        change: 0.18,
        changeLabel: "+18% this quarter",
        intent: "positive",
        hint: "Total unique borrowers onboarded in the credit portfolio.",
      },
      {
        key: "active_loans",
        label: "Active Loans",
        value: activeLoans.toString(),
        raw: activeLoans,
        change: 0.12,
        changeLabel: "+12% active book",
        intent: "positive",
        hint: "Performing and active loan facilities currently disbursed.",
      },
      {
        key: "total_exposure",
        label: "Total Disbursed",
        value: KES(totalExposure, true),
        raw: totalExposure,
        change: 0.22,
        changeLabel: "+22% vs target",
        intent: "positive",
        hint: "Total original principal disbursed across active facilities.",
      },
      {
        key: "outstanding_balance",
        label: "Outstanding Balance",
        value: KES(outstandingBalance, true),
        raw: outstandingBalance,
        change: 0.14,
        changeLabel: "+14% active risk",
        intent: "neutral",
        hint: "Current outstanding unpaid principal awaiting maturity or repayment.",
      },
      {
        key: "average_pd",
        label: "Portfolio Mean PD",
        value: pct(avgPd, 1),
        raw: avgPd,
        change: -0.014,
        changeLabel: "-1.4pp risk reduction",
        intent: "positive",
        hint: "Weighted average probability of default across live facilities.",
      },
      {
        key: "default_rate",
        label: "Historical Default Rate",
        value: pct(defaultRate, 1),
        raw: defaultRate,
        change: -0.008,
        changeLabel: "-0.8pp vs annual limit",
        intent: "positive",
        hint: "Observed percentage of facilities transitioning into 90+ DPD default.",
      },
      {
        key: "high_risk_exposure",
        label: "High-Risk Exposure",
        value: KES(highRiskExposure, true),
        raw: highRiskExposure,
        change: 0.045,
        changeLabel: "+4.5% watch queue",
        intent: "negative",
        hint: "Capital deployed to High and Severe risk segments.",
      },
      {
        key: "repayment_rate",
        label: "On-Time Repayment",
        value: "92.4%",
        raw: 0.924,
        change: 0.021,
        changeLabel: "+2.1pp compliance",
        intent: "positive",
        hint: "Instalments received on or before contractual due date.",
      },
    ];

    const distribution = [
      {
        band: "low" as const,
        label: "Low Risk",
        count: 20,
        exposure: 4_250_000,
        share: 0.54,
      },
      {
        band: "medium" as const,
        label: "Medium Risk",
        count: 16,
        exposure: 2_150_000,
        share: 0.27,
      },
      {
        band: "high" as const,
        label: "High Risk",
        count: 10,
        exposure: 1_120_000,
        share: 0.14,
      },
      {
        band: "severe" as const,
        label: "Very High Risk",
        count: 6,
        exposure: 380_000,
        share: 0.05,
      },
    ];

    const defaultTrend: SeriesPoint[] = [
      { date: "Oct 25", rate: 5.2, target: 6.0 },
      { date: "Nov 25", rate: 4.9, target: 6.0 },
      { date: "Dec 25", rate: 5.4, target: 6.0 },
      { date: "Jan 26", rate: 4.8, target: 6.0 },
      { date: "Feb 26", rate: 4.4, target: 6.0 },
      { date: "Mar 26", rate: 4.1, target: 6.0 },
    ];

    const exposureTrend: SeriesPoint[] = [
      { date: "Oct 25", low: 3.1, medium: 1.8, high: 0.9, severe: 0.3 },
      { date: "Nov 25", low: 3.4, medium: 1.9, high: 0.9, severe: 0.3 },
      { date: "Dec 25", low: 3.7, medium: 2.0, high: 1.0, severe: 0.4 },
      { date: "Jan 26", low: 3.9, medium: 2.1, high: 1.0, severe: 0.3 },
      { date: "Feb 26", low: 4.1, medium: 2.1, high: 1.1, severe: 0.4 },
      { date: "Mar 26", low: 4.25, medium: 2.15, high: 1.12, severe: 0.38 },
    ];

    const approvalTrend: SeriesPoint[] = [
      { date: "Oct 25", approved: 72, volume: 220 },
      { date: "Nov 25", approved: 75, volume: 260 },
      { date: "Dec 25", approved: 70, volume: 310 },
      { date: "Jan 26", approved: 78, volume: 280 },
      { date: "Feb 26", approved: 80, volume: 340 },
      { date: "Mar 26", approved: 82, volume: 390 },
    ];

    const loanSizeDistribution = [
      { bucket: "< KES 25K", count: 18, exposure: 360_000 },
      { bucket: "25K–50K", count: 15, exposure: 580_000 },
      { bucket: "50K–100K", count: 12, exposure: 920_000 },
      { bucket: "100K–200K", count: 5, exposure: 850_000 },
      { bucket: "> 200K", count: 2, exposure: 550_000 },
    ];

    const defaultByPurpose = [
      { purpose: "Business Capital", defaultRate: 0.038, loans: 24 },
      { purpose: "School Fees", defaultRate: 0.021, loans: 16 },
      { purpose: "Agri Inputs", defaultRate: 0.062, loans: 14 },
      { purpose: "Asset Purchase", defaultRate: 0.029, loans: 10 },
      { purpose: "Medical", defaultRate: 0.048, loans: 8 },
      { purpose: "Emergency", defaultRate: 0.075, loans: 6 },
    ];

    const defaultByBand = [
      { band: "Low Risk", defaultRate: 0.012, loans: 32 },
      { band: "Medium Risk", defaultRate: 0.046, loans: 26 },
      { band: "High Risk", defaultRate: 0.148, loans: 14 },
      { band: "Very High Risk", defaultRate: 0.342, loans: 6 },
    ];

    const defaultByCohort = [
      { cohort: "Q1 2025", defaultRate: 0.058, borrowers: 38 },
      { cohort: "Q2 2025", defaultRate: 0.051, borrowers: 42 },
      { cohort: "Q3 2025", defaultRate: 0.046, borrowers: 48 },
      { cohort: "Q4 2025", defaultRate: 0.042, borrowers: 52 },
      { cohort: "Q1 2026", defaultRate: 0.039, borrowers: 56 },
    ];

    return {
      kpis,
      distribution,
      defaultTrend,
      exposureTrend,
      approvalTrend,
      loanSizeDistribution,
      defaultByPurpose,
      defaultByBand,
      defaultByCohort,
    };
  },
};
