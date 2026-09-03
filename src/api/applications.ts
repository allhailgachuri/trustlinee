import type { Application, Borrower, Decision, Loan, RepaymentEvent, RiskAssessment, RiskBand } from "@/lib/types";
import { applications, auditEvents, borrowers, loans, repaymentEvents, assessments } from "@/data/dataset";
import { sleep } from "./client";

// Local mutable copy of applications for demo interactivity
let appStore = [...applications];

export interface ApplicationDetailResponse {
  application: Application;
  borrower: Borrower;
  loan: Loan;
  repayments: RepaymentEvent[];
  latestAssessment?: RiskAssessment;
  assessmentHistory: RiskAssessment[];
}

export const applicationsApi = {
  async getApplications(params?: {
    search?: string;
    riskBand?: RiskBand | "all";
    decision?: Decision | "all";
    page?: number;
    pageSize?: number;
    sortBy?: keyof Application;
    sortOrder?: "asc" | "desc";
  }): Promise<{ items: Application[]; total: number; page: number; pageSize: number; totalPages: number }> {
    await sleep(150);

    let filtered = [...appStore];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.borrowerName.toLowerCase().includes(q) ||
          a.borrowerId.toLowerCase().includes(q),
      );
    }

    if (params?.riskBand && params.riskBand !== "all") {
      filtered = filtered.filter((a) => a.riskBand === params.riskBand);
    }

    if (params?.decision && params.decision !== "all") {
      filtered = filtered.filter((a) => a.decision === params.decision);
    }

    const sortBy = params?.sortBy || "createdAt";
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

  async getApplicationById(id: string): Promise<ApplicationDetailResponse | null> {
    await sleep(180);

    const app = appStore.find((a) => a.id === id);
    if (!app) return null;

    const borrower = borrowers.find((b) => b.id === app.borrowerId) || borrowers[0]!;
    const loan = loans.find((l) => l.id === app.loanId) || loans[0]!;
    const repayments = repaymentEvents[borrower.id] || [];
    const history = assessments[borrower.id] || [];
    const latestAssessment = history[0];

    return {
      application: app,
      borrower,
      loan,
      repayments,
      latestAssessment,
      assessmentHistory: history,
    };
  },

  async updateDecision(
    id: string,
    decision: Decision,
    notes?: string,
    reviewer = "Dr. Sarah Kimani",
  ): Promise<Application> {
    await sleep(250);

    const index = appStore.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Application ${id} not found`);
    }

    const updated: Application = {
      ...appStore[index]!,
      decision,
      reviewedBy: reviewer,
      notes: notes || appStore[index]!.notes,
    };

    appStore[index] = updated;

    // Record audit event
    auditEvents.unshift({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: reviewer,
      action: `Decision updated to ${decision.toUpperCase()}`,
      entity: "Application",
      entityId: id,
      result: "success",
    });

    return updated;
  },
};
