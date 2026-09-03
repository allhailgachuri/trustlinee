import type { AnalyticsData, SeriesPoint } from "@/lib/types";
import { borrowers } from "@/data/dataset";
import { sleep } from "./client";

export const analyticsApi = {
  async getAnalyticsData(): Promise<AnalyticsData> {
    await sleep(220);

    const pdDistribution = [
      { bucket: "0–4%", count: 18 },
      { bucket: "4–8%", count: 14 },
      { bucket: "8–12%", count: 9 },
      { bucket: "12–18%", count: 5 },
      { bucket: "18–25%", count: 4 },
      { bucket: "25–40%", count: 2 },
    ];

    const defaultByUtilisation = [
      { bucket: "< 20%", defaultRate: 0.012, borrowers: 16 },
      { bucket: "20–40%", defaultRate: 0.028, borrowers: 14 },
      { bucket: "40–60%", defaultRate: 0.054, borrowers: 11 },
      { bucket: "60–80%", defaultRate: 0.128, borrowers: 7 },
      { bucket: "> 80%", defaultRate: 0.285, borrowers: 4 },
    ];

    const defaultByRepaymentConsistency = [
      { bucket: "95–100%", defaultRate: 0.008, borrowers: 20 },
      { bucket: "85–95%", defaultRate: 0.032, borrowers: 15 },
      { bucket: "70–85%", defaultRate: 0.089, borrowers: 10 },
      { bucket: "50–70%", defaultRate: 0.215, borrowers: 5 },
      { bucket: "< 50%", defaultRate: 0.44, borrowers: 2 },
    ];

    const defaultByVolatility = [
      { bucket: "Low (<0.15)", defaultRate: 0.015, borrowers: 19 },
      { bucket: "Moderate (0.15-0.35)", defaultRate: 0.048, borrowers: 18 },
      { bucket: "Elevated (0.35-0.55)", defaultRate: 0.134, borrowers: 10 },
      { bucket: "Severe (>0.55)", defaultRate: 0.312, borrowers: 5 },
    ];

    const defaultByTenure = [
      { bucket: "> 36 months", defaultRate: 0.014, borrowers: 22 },
      { bucket: "24–36 months", defaultRate: 0.038, borrowers: 14 },
      { bucket: "12–24 months", defaultRate: 0.076, borrowers: 9 },
      { bucket: "< 12 months", defaultRate: 0.168, borrowers: 7 },
    ];

    const defaultByLoanAmount = [
      { bucket: "< KES 20K", defaultRate: 0.032, borrowers: 18 },
      { bucket: "20K–50K", defaultRate: 0.041, borrowers: 16 },
      { bucket: "50K–100K", defaultRate: 0.058, borrowers: 11 },
      { bucket: "100K–200K", defaultRate: 0.092, borrowers: 5 },
      { bucket: "> 200K", defaultRate: 0.145, borrowers: 2 },
    ];

    const repaymentTrend: SeriesPoint[] = [
      { date: "Oct", onTime: 91.2, late: 6.8, missed: 2.0 },
      { date: "Nov", onTime: 92.4, late: 5.9, missed: 1.7 },
      { date: "Dec", onTime: 89.8, late: 7.8, missed: 2.4 },
      { date: "Jan", onTime: 93.1, late: 5.4, missed: 1.5 },
      { date: "Feb", onTime: 94.2, late: 4.6, missed: 1.2 },
      { date: "Mar", onTime: 94.8, late: 4.2, missed: 1.0 },
    ];

    const behaviourScatter = borrowers.map((b) => ({
      utilisation: Math.round(b.transactions.utilisationRatio * 100),
      pd: Number((b.probabilityOfDefault * 100).toFixed(1)),
      volatility: Number(b.transactions.transactionVolatility.toFixed(2)),
      band: b.riskBand,
    }));

    const altDataCoverage = [
      { feature: "Mobile-Money Inflow Velocity", coverage: 0.98, freshness: "< 1 hour" },
      { feature: "Repayment Consistency Index", coverage: 0.96, freshness: "Real-time" },
      { feature: "Transaction Volatility Metric", coverage: 0.94, freshness: "Daily" },
      { feature: "Cash Flow Utilisation Ratio", coverage: 0.91, freshness: "Daily" },
      { feature: "Account Tenure Duration", coverage: 1.0, freshness: "Static" },
      { feature: "Historical Delinquency Velocity", coverage: 0.89, freshness: "Real-time" },
      { feature: "Merchant Turnover Regularity", coverage: 0.84, freshness: "Daily" },
      { feature: "Utility & Airtime Bill Consistency", coverage: 0.78, freshness: "Weekly" },
    ];

    return {
      pdDistribution,
      defaultByUtilisation,
      defaultByRepaymentConsistency,
      defaultByVolatility,
      defaultByTenure,
      defaultByLoanAmount,
      repaymentTrend,
      behaviourScatter,
      altDataCoverage,
    };
  },
};
