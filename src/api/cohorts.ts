import type { Cohort } from "@/lib/types";
import { sleep } from "./client";

export const cohortsApi = {
  async getCohorts(
    dimension: "quarter" | "month" | "segment" | "purpose" | "band" = "quarter",
  ): Promise<Cohort[]> {
    await sleep(180);

    switch (dimension) {
      case "quarter":
        return [
          {
            id: "Q1-2025",
            label: "Q1 2025 Cohort",
            dimension: "quarter",
            borrowers: 38,
            defaultRate: 0.058,
            repaymentRate: 0.892,
            averagePd: 0.074,
            averageLoanSize: 34_500,
            approvalRate: 0.74,
          },
          {
            id: "Q2-2025",
            label: "Q2 2025 Cohort",
            dimension: "quarter",
            borrowers: 42,
            defaultRate: 0.051,
            repaymentRate: 0.908,
            averagePd: 0.068,
            averageLoanSize: 38_000,
            approvalRate: 0.76,
          },
          {
            id: "Q3-2025",
            label: "Q3 2025 Cohort",
            dimension: "quarter",
            borrowers: 48,
            defaultRate: 0.046,
            repaymentRate: 0.924,
            averagePd: 0.062,
            averageLoanSize: 42_000,
            approvalRate: 0.78,
          },
          {
            id: "Q4-2025",
            label: "Q4 2025 Cohort",
            dimension: "quarter",
            borrowers: 52,
            defaultRate: 0.042,
            repaymentRate: 0.936,
            averagePd: 0.058,
            averageLoanSize: 45_500,
            approvalRate: 0.81,
          },
          {
            id: "Q1-2026",
            label: "Q1 2026 Cohort (Live)",
            dimension: "quarter",
            borrowers: 56,
            defaultRate: 0.038,
            repaymentRate: 0.948,
            averagePd: 0.052,
            averageLoanSize: 49_000,
            approvalRate: 0.83,
          },
        ];

      case "segment":
        return [
          {
            id: "salaried",
            label: "Salaried Employees",
            dimension: "segment",
            borrowers: 22,
            defaultRate: 0.021,
            repaymentRate: 0.965,
            averagePd: 0.032,
            averageLoanSize: 68_000,
            approvalRate: 0.88,
          },
          {
            id: "micro_business",
            label: "Micro-Business Owners",
            dimension: "segment",
            borrowers: 18,
            defaultRate: 0.042,
            repaymentRate: 0.932,
            averagePd: 0.059,
            averageLoanSize: 44_000,
            approvalRate: 0.81,
          },
          {
            id: "informal_trader",
            label: "Informal Market Traders",
            dimension: "segment",
            borrowers: 12,
            defaultRate: 0.064,
            repaymentRate: 0.895,
            averagePd: 0.082,
            averageLoanSize: 28_000,
            approvalRate: 0.72,
          },
          {
            id: "smallholder_farmer",
            label: "Smallholder Farmers",
            dimension: "segment",
            borrowers: 8,
            defaultRate: 0.078,
            repaymentRate: 0.868,
            averagePd: 0.098,
            averageLoanSize: 32_000,
            approvalRate: 0.69,
          },
        ];

      case "purpose":
        return [
          {
            id: "working_capital",
            label: "Business Working Capital",
            dimension: "purpose",
            borrowers: 28,
            defaultRate: 0.038,
            repaymentRate: 0.941,
            averagePd: 0.048,
            averageLoanSize: 52_000,
            approvalRate: 0.84,
          },
          {
            id: "school_fees",
            label: "School Fees Advance",
            dimension: "purpose",
            borrowers: 16,
            defaultRate: 0.021,
            repaymentRate: 0.968,
            averagePd: 0.035,
            averageLoanSize: 35_000,
            approvalRate: 0.89,
          },
          {
            id: "agriculture",
            label: "Agricultural Inputs",
            dimension: "purpose",
            borrowers: 10,
            defaultRate: 0.062,
            repaymentRate: 0.892,
            averagePd: 0.081,
            averageLoanSize: 30_000,
            approvalRate: 0.71,
          },
          {
            id: "asset_purchase",
            label: "Productive Asset Purchase",
            dimension: "purpose",
            borrowers: 8,
            defaultRate: 0.029,
            repaymentRate: 0.952,
            averagePd: 0.041,
            averageLoanSize: 85_000,
            approvalRate: 0.82,
          },
          {
            id: "emergency",
            label: "Emergency Liquidity",
            dimension: "purpose",
            borrowers: 6,
            defaultRate: 0.075,
            repaymentRate: 0.875,
            averagePd: 0.095,
            averageLoanSize: 18_000,
            approvalRate: 0.65,
          },
        ];

      case "band":
      default:
        return [
          {
            id: "band_low",
            label: "Low Risk Band (PD < 5%)",
            dimension: "band",
            borrowers: 20,
            defaultRate: 0.012,
            repaymentRate: 0.982,
            averagePd: 0.024,
            averageLoanSize: 62_000,
            approvalRate: 0.96,
          },
          {
            id: "band_medium",
            label: "Medium Risk Band (PD 5–12%)",
            dimension: "band",
            borrowers: 16,
            defaultRate: 0.046,
            repaymentRate: 0.925,
            averagePd: 0.078,
            averageLoanSize: 41_000,
            approvalRate: 0.82,
          },
          {
            id: "band_high",
            label: "High Risk Band (PD 12–25%)",
            dimension: "band",
            borrowers: 10,
            defaultRate: 0.148,
            repaymentRate: 0.812,
            averagePd: 0.182,
            averageLoanSize: 26_000,
            approvalRate: 0.45,
          },
          {
            id: "band_severe",
            label: "Severe Risk Band (PD > 25%)",
            dimension: "band",
            borrowers: 6,
            defaultRate: 0.342,
            repaymentRate: 0.625,
            averagePd: 0.384,
            averageLoanSize: 15_000,
            approvalRate: 0.12,
          },
        ];
    }
  },
};
