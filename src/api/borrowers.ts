import type { Application, Borrower, Loan, RepaymentEvent, RiskAssessment, RiskBand } from "@/lib/types";
import { applications, borrowers, loans, repaymentEvents, assessments } from "@/data/dataset";
import { sleep } from "./client";

export interface BorrowerDetailResponse {
  borrower: Borrower;
  loans: Loan[];
  applications: Application[];
  repayments: RepaymentEvent[];
  assessments: RiskAssessment[];
  latestAssessment?: RiskAssessment;
}

export const borrowersApi = {
  async getBorrowers(params?: {
    search?: string;
    segment?: Borrower["segment"] | "all";
    riskBand?: RiskBand | "all";
    page?: number;
    pageSize?: number;
    sortBy?: keyof Borrower;
    sortOrder?: "asc" | "desc";
  }): Promise<{ items: Borrower[]; total: number; page: number; pageSize: number; totalPages: number }> {
    await sleep(150);

    let filtered = [...borrowers];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.name.toLowerCase().includes(q) ||
          b.county.toLowerCase().includes(q),
      );
    }

    if (params?.segment && params.segment !== "all") {
      filtered = filtered.filter((b) => b.segment === params.segment);
    }

    if (params?.riskBand && params.riskBand !== "all") {
      filtered = filtered.filter((b) => b.riskBand === params.riskBand);
    }

    const sortBy = params?.sortBy || "riskScore";
    const sortOrder = params?.sortOrder || "desc";

    filtered.sort((a, b) => {
      const aVal = a[sortBy] ?? "";
      const bVal = b[sortBy] ?? "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  },

  async getBorrowerById(id: string): Promise<BorrowerDetailResponse | null> {
    await sleep(180);

    const borrower = borrowers.find((b) => b.id === id);
    if (!borrower) return null;

    const bLoans = loans.filter((l) => l.borrowerId === id);
    const bApps = applications.filter((a) => a.borrowerId === id);
    const bRepayments = repaymentEvents[id] || [];
    const bAssessments = assessments[id] || [];

    return {
      borrower,
      loans: bLoans,
      applications: bApps,
      repayments: bRepayments,
      assessments: bAssessments,
      latestAssessment: bAssessments[0],
    };
  },
};
