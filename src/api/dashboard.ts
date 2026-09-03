import type { DashboardData, KpiMetric, SeriesPoint } from "@/lib/types";
import { applications, borrowers, loans } from "@/data/dataset";
import { KES, pct } from "@/lib/format";
import { sleep } from "./client";

export const dashboardApi = {
  async getDashboardData(timeRange: "24h" | "7d" | "30d" | "90d" = "30d"): Promise<DashboardData> {
    await sleep(220);

    const multiplier =
      timeRange === "24h" ? 0.25 : timeRange === "7d" ? 0.6 : timeRange === "30d" ? 1 : 1.4;

    const totalApps = Math.round(applications.length * multiplier);
    const approvedApps = Math.round(applications.filter((a) => a.decision === "approved").length * multiplier);
    const pendingApps = applications.filter((a) => a.decision === "pending").length;
    const avgPd =
      applications.reduce((acc, a) => acc + a.probabilityOfDefault, 0) / applications.length;
    const highRiskBorrowers = borrowers.filter(
      (b) => b.riskBand === "high" || b.riskBand === "severe",
    ).length;
    const totalExposure = loans
      .filter((l) => l.status === "active")
      .reduce((acc, l) => acc + l.outstanding, 0);
    const defaultRate =
      loans.filter((l) => l.status === "defaulted").length / Math.max(1, loans.length);
    const approvalRate =
      applications.filter((a) => a.decision === "approved").length /
      Math.max(1, applications.filter((a) => a.decision !== "pending").length);

    const kpis: KpiMetric[] = [
      {
        key: "total_applications",
        label: "Total Applications",
        value: totalApps.toString(),
        raw: totalApps,
        change: 0.124,
        changeLabel: "+12.4% vs last period",
        intent: "positive",
        hint: "Total credit applications received across all channels within selected window.",
      },
      {
        key: "approved_applications",
        label: "Approved Applications",
        value: approvedApps.toString(),
        raw: approvedApps,
        change: 0.082,
        changeLabel: "+8.2% vs last period",
        intent: "positive",
        hint: "Applications approved by underwriters supported by risk scoring.",
      },
      {
        key: "pending_review",
        label: "Pending Review",
        value: pendingApps.toString(),
        raw: pendingApps,
        change: -0.045,
        changeLabel: "-4.5% queue backlog",
        intent: "neutral",
        hint: "Applications in queue awaiting credit analyst evaluation.",
      },
      {
        key: "average_pd",
        label: "Average PD",
        value: pct(avgPd, 1),
        raw: avgPd,
        change: -0.011,
        changeLabel: "-1.1pp lower risk",
        intent: "positive",
        hint: "Mean estimated probability of default across current borrower portfolio.",
      },
      {
        key: "high_risk_borrowers",
        label: "High-Risk Borrowers",
        value: highRiskBorrowers.toString(),
        raw: highRiskBorrowers,
        change: 0.032,
        changeLabel: "+3.2% vs baseline",
        intent: "negative",
        hint: "Borrowers placed in High or Very High (Severe) risk bands.",
      },
      {
        key: "portfolio_exposure",
        label: "Portfolio Exposure",
        value: KES(totalExposure, true),
        raw: totalExposure,
        change: 0.158,
        changeLabel: "+15.8% active book",
        intent: "positive",
        hint: "Total active principal outstanding across all performing loans.",
      },
      {
        key: "default_rate",
        label: "Observed Default Rate",
        value: pct(defaultRate, 1),
        raw: defaultRate,
        change: -0.006,
        changeLabel: "-0.6pp vs Q4",
        intent: "positive",
        hint: "Actual 90+ DPD default rate observed in historical cohorts.",
      },
      {
        key: "approval_rate",
        label: "Approval Rate",
        value: pct(approvalRate, 1),
        raw: approvalRate,
        change: 0.021,
        changeLabel: "+2.1% throughput",
        intent: "positive",
        hint: "Proportion of reviewed applications resulting in approval.",
      },
    ];

    const riskBandDistribution = [
      {
        band: "low" as const,
        label: "Low Risk",
        count: borrowers.filter((b) => b.riskBand === "low").length,
        exposure: loans
          .filter((l) => borrowers.find((b) => b.id === l.borrowerId)?.riskBand === "low")
          .reduce((sum, l) => sum + l.outstanding, 0),
      },
      {
        band: "medium" as const,
        label: "Medium Risk",
        count: borrowers.filter((b) => b.riskBand === "medium").length,
        exposure: loans
          .filter((l) => borrowers.find((b) => b.id === l.borrowerId)?.riskBand === "medium")
          .reduce((sum, l) => sum + l.outstanding, 0),
      },
      {
        band: "high" as const,
        label: "High Risk",
        count: borrowers.filter((b) => b.riskBand === "high").length,
        exposure: loans
          .filter((l) => borrowers.find((b) => b.id === l.borrowerId)?.riskBand === "high")
          .reduce((sum, l) => sum + l.outstanding, 0),
      },
      {
        band: "severe" as const,
        label: "Very High Risk",
        count: borrowers.filter((b) => b.riskBand === "severe").length,
        exposure: loans
          .filter((l) => borrowers.find((b) => b.id === l.borrowerId)?.riskBand === "severe")
          .reduce((sum, l) => sum + l.outstanding, 0),
      },
    ];

    const defaultRateOverTime: SeriesPoint[] = [
      { date: "Oct 25", baseline: 5.4, observed: 4.8, predicted: 4.9 },
      { date: "Nov 25", baseline: 5.6, observed: 4.6, predicted: 4.7 },
      { date: "Dec 25", baseline: 5.9, observed: 5.1, predicted: 5.0 },
      { date: "Jan 26", baseline: 5.8, observed: 4.5, predicted: 4.6 },
      { date: "Feb 26", baseline: 5.5, observed: 4.2, predicted: 4.3 },
      { date: "Mar 26", baseline: 5.3, observed: 3.9, predicted: 4.0 },
    ];

    const applicationsOverTime: SeriesPoint[] = [
      { date: "W1", received: 18, approved: 12, rejected: 4, referred: 2 },
      { date: "W2", received: 24, approved: 17, rejected: 5, referred: 2 },
      { date: "W3", received: 29, approved: 19, rejected: 7, referred: 3 },
      { date: "W4", received: 22, approved: 15, rejected: 5, referred: 2 },
      { date: "W5", received: 34, approved: 23, rejected: 8, referred: 3 },
      { date: "W6", received: 31, approved: 22, rejected: 6, referred: 3 },
    ];

    const approvalVsRejection: SeriesPoint[] = [
      { date: "Oct", approved: 72, rejected: 21, referred: 7 },
      { date: "Nov", approved: 74, rejected: 19, referred: 7 },
      { date: "Dec", approved: 69, rejected: 24, referred: 7 },
      { date: "Jan", approved: 76, rejected: 18, referred: 6 },
      { date: "Feb", approved: 79, rejected: 16, referred: 5 },
      { date: "Mar", approved: 81, rejected: 14, referred: 5 },
    ];

    const pdDistribution = [
      { bucket: "0–5%", count: 20 },
      { bucket: "5–10%", count: 14 },
      { bucket: "10–15%", count: 8 },
      { bucket: "15–20%", count: 5 },
      { bucket: "20–30%", count: 3 },
      { bucket: "30–50%", count: 2 },
    ];

    const highRiskApplications = applications
      .filter((a) => a.riskBand === "high" || a.riskBand === "severe" || a.decision === "pending")
      .slice(0, 8);

    return {
      kpis,
      riskBandDistribution,
      defaultRateOverTime,
      applicationsOverTime,
      approvalVsRejection,
      pdDistribution,
      exposureByBand: riskBandDistribution.map((r) => ({
        band: r.band,
        label: r.label,
        exposure: r.exposure,
      })),
      highRiskApplications,
    };
  },
};
