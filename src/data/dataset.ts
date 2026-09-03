/**
 * Synthetic demo dataset for Trustline.
 *
 * Every borrower, application, loan and metric below is fabricated for
 * demonstration purposes. No real person, lender, bank, mobile-money provider
 * or credit reference bureau is represented. IDs, names and amounts are
 * fictional. Currency is KES.
 */

import type {
  Application,
  AuditEvent,
  Borrower,
  Loan,
  LoanPurpose,
  Notification,
  RepaymentEvent,
  RiskAssessment,
  User,
} from "@/lib/types";
import { bandForPd, recommendationFor, scoreApplicant, scoreForPd } from "@/lib/risk-engine";

/* ---------------------------------- rng ---------------------------------- */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260903);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)] as T;
const between = (min: number, max: number) => min + rand() * (max - min);
const intBetween = (min: number, max: number) => Math.round(between(min, max));

/* ------------------------------ demo identity ----------------------------- */

const FIRST = [
  "Amara","Baraka","Chebet","Dalmas","Eshe","Fumo","Githinji","Halima","Imani","Jabari",
  "Kesi","Lulu","Mwenda","Nafula","Otieno","Pendo","Rehema","Sifa","Tabitha","Uzima",
  "Wekesa","Zawadi","Ochieng","Naliaka","Kiptoo","Mueni","Sanaipei","Barasa","Nyambura","Kimutai",
];
const LAST = [
  "Achieng","Bett","Chirchir","Dzombo","Ekiru","Faraja","Gathoni","Hamisi","Injendi","Juma",
  "Kariuki","Lagat","Mutiso","Ndegwa","Omondi","Peleka","Ruto","Simiyu","Tuwei","Wanjala",
];
const COUNTIES = ["Nairobi","Kisumu","Nakuru","Mombasa","Eldoret","Meru","Machakos","Kakamega","Nyeri","Kitui"];
const PURPOSES: LoanPurpose[] = [
  "business_working_capital","school_fees","agriculture_inputs","medical","asset_purchase","emergency",
];
const SEGMENTS: Borrower["segment"][] = ["salaried","micro_business","informal_trader","smallholder_farmer"];

const MONTHS = ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];

/* ------------------------------- scenarios -------------------------------- */

type Profile = "low" | "medium" | "high" | "severe";

const PROFILE_MIX: Profile[] = [
  ...Array<Profile>(20).fill("low"),
  ...Array<Profile>(16).fill("medium"),
  ...Array<Profile>(10).fill("high"),
  ...Array<Profile>(6).fill("severe"),
];

function profileTraits(profile: Profile) {
  switch (profile) {
    case "low":
      return {
        repaymentConsistency: between(0.88, 0.99),
        utilisationRatio: between(0.08, 0.3),
        transactionVolatility: between(0.06, 0.22),
        accountTenureMonths: intBetween(30, 84),
        daysPastDue: intBetween(0, 3),
        previousDefaults: 0,
        income: intBetween(45_000, 190_000),
        txFreq: intBetween(26, 58),
      };
    case "medium":
      return {
        repaymentConsistency: between(0.7, 0.88),
        utilisationRatio: between(0.3, 0.55),
        transactionVolatility: between(0.22, 0.42),
        accountTenureMonths: intBetween(14, 40),
        daysPastDue: intBetween(3, 22),
        previousDefaults: rand() > 0.8 ? 1 : 0,
        income: intBetween(28_000, 95_000),
        txFreq: intBetween(14, 34),
      };
    case "high":
      return {
        repaymentConsistency: between(0.45, 0.7),
        utilisationRatio: between(0.55, 0.8),
        transactionVolatility: between(0.42, 0.66),
        accountTenureMonths: intBetween(6, 22),
        daysPastDue: intBetween(20, 55),
        previousDefaults: rand() > 0.5 ? 1 : 0,
        income: intBetween(18_000, 60_000),
        txFreq: intBetween(8, 22),
      };
    case "severe":
      return {
        repaymentConsistency: between(0.2, 0.46),
        utilisationRatio: between(0.78, 0.98),
        transactionVolatility: between(0.6, 0.92),
        accountTenureMonths: intBetween(2, 12),
        daysPastDue: intBetween(50, 95),
        previousDefaults: intBetween(1, 3),
        income: intBetween(12_000, 42_000),
        txFreq: intBetween(4, 14),
      };
  }
}

/* ------------------------------- borrowers -------------------------------- */

const isoDaysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

function buildBorrower(index: number, profile: Profile): Borrower {
  const t = profileTraits(profile);
  const id = `BOR-${10_400 + index * 7}`;
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  const segment = pick(SEGMENTS);
  const loanAmount = Math.round(between(5_000, 220_000) / 500) * 500;

  const scored = scoreApplicant({
    age: intBetween(21, 58),
    monthlyIncome: t.income,
    employmentStatus: "self_employed",
    dependants: intBetween(0, 5),
    residenceType: "rented",
    loanAmount,
    tenureMonths: pick([3, 6, 9, 12, 18, 24]),
    purpose: pick(PURPOSES),
    transactionFrequency: t.txFreq,
    averageMonthlyInflow: t.income * between(0.9, 1.6),
    transactionVolatility: t.transactionVolatility,
    averageBalance: t.income * between(0.15, 0.9),
    utilisationRatio: t.utilisationRatio,
    repaymentConsistency: t.repaymentConsistency,
    previousLoans: intBetween(0, 9),
    daysPastDue: t.daysPastDue,
    previousDefaults: t.previousDefaults,
    accountTenureMonths: t.accountTenureMonths,
    activeAccounts: intBetween(1, 4),
  });

  const inflow = Math.round(t.income * between(0.9, 1.6));
  const outflow = Math.round(inflow * between(0.6, 0.97));

  const monthly = MONTHS.map((month, i) => {
    const wobble = 1 + Math.sin(i * 1.1 + index) * t.transactionVolatility * 0.6;
    return {
      month,
      inflow: Math.round(inflow * wobble),
      outflow: Math.round(outflow * (1 + Math.cos(i * 0.9 + index) * t.transactionVolatility * 0.5)),
      count: Math.max(1, Math.round(t.txFreq * wobble)),
      volatility: Number(Math.min(1, Math.max(0.02, t.transactionVolatility * wobble)).toFixed(3)),
    };
  });

  const previousLoans = intBetween(1, 9);
  const activeLoans = profile === "severe" ? intBetween(1, 3) : intBetween(0, 2);
  const totalBorrowed = Math.round(previousLoans * between(8_000, 90_000));

  return {
    id,
    name,
    segment,
    age: intBetween(21, 58),
    county: pick(COUNTIES),
    residenceType: pick(["owned", "rented", "family"] as const),
    employmentStatus: pick(["employed", "self_employed", "casual", "business_owner"] as const),
    dependants: intBetween(0, 5),
    monthlyIncome: t.income,
    accountTenureMonths: t.accountTenureMonths,
    activeAccounts: intBetween(1, 4),
    joinedAt: isoDaysAgo(t.accountTenureMonths * 30),
    riskScore: scored.riskScore,
    probabilityOfDefault: scored.probabilityOfDefault,
    riskBand: scored.riskBand,
    activeLoans,
    totalBorrowed,
    outstandingBalance: activeLoans > 0 ? Math.round(between(3_000, 140_000)) : 0,
    lastAssessment: isoDaysAgo(intBetween(0, 45)),
    transactions: {
      monthlyTransactionCount: t.txFreq,
      averageTransactionAmount: Math.round(inflow / Math.max(1, t.txFreq)),
      transactionVolatility: Number(t.transactionVolatility.toFixed(2)),
      averageMonthlyInflow: inflow,
      averageMonthlyOutflow: outflow,
      averageBalance: Math.round(t.income * between(0.15, 0.9)),
      utilisationRatio: Number(t.utilisationRatio.toFixed(2)),
      monthly,
    },
    repayment: {
      repaymentConsistency: Number(t.repaymentConsistency.toFixed(2)),
      previousLoans,
      daysPastDueMax: t.daysPastDue,
      averageDaysPastDue: Math.round(t.daysPastDue * 0.45),
      previousDefaults: t.previousDefaults,
      onTimeRate: Number(Math.min(0.99, t.repaymentConsistency * between(0.95, 1.05)).toFixed(2)),
    },
  };
}

export const borrowers: Borrower[] = PROFILE_MIX.map((profile, i) => buildBorrower(i, profile));

/* --------------------------------- loans ---------------------------------- */

export const loans: Loan[] = borrowers.flatMap((b, bi) => {
  const count = 1 + Math.floor(rand() * 3);
  return Array.from({ length: count }, (_, li) => {
    const amount = Math.round(between(5_000, 200_000) / 500) * 500;
    const status =
      b.riskBand === "severe" && li === 0
        ? rand() > 0.5
          ? ("defaulted" as const)
          : ("active" as const)
        : li === 0
          ? ("active" as const)
          : ("completed" as const);
    return {
      id: `LOAN-${83_000 + bi * 31 + li}`,
      borrowerId: b.id,
      amount,
      tenureMonths: pick([3, 6, 9, 12, 18, 24]),
      purpose: pick(PURPOSES),
      issuedAt: isoDaysAgo(intBetween(20, 700)),
      status,
      outstanding: status === "active" ? Math.round(amount * between(0.2, 0.9)) : 0,
      interestRate: Number(between(0.09, 0.28).toFixed(3)),
    };
  });
});

/* ------------------------------ applications ------------------------------ */

export const applications: Application[] = borrowers.flatMap((b, bi) => {
  const count = 1 + Math.floor(rand() * 3);
  return Array.from({ length: count }, (_, ai) => {
    const amount = Math.round(between(5_000, 250_000) / 500) * 500;
    const pdJitter = Math.max(0.004, Math.min(0.94, b.probabilityOfDefault * between(0.82, 1.2)));
    const band = bandForPd(pdJitter);
    const daysAgo = intBetween(0, 89);
    const decision: Application["decision"] =
      daysAgo < 4
        ? "pending"
        : band === "low"
          ? rand() > 0.08
            ? "approved"
            : "referred"
          : band === "medium"
            ? rand() > 0.3
              ? "approved"
              : "referred"
            : band === "high"
              ? rand() > 0.6
                ? "referred"
                : "rejected"
              : rand() > 0.85
                ? "referred"
                : "rejected";

    return {
      id: `APP-2026-${String(100 + bi * 3 + ai).padStart(5, "0")}`,
      borrowerId: b.id,
      borrowerName: b.name,
      loanId: `LOAN-${83_000 + bi * 31 + ai}`,
      amount,
      tenureMonths: pick([3, 6, 9, 12, 18, 24]),
      purpose: pick(PURPOSES),
      probabilityOfDefault: pdJitter,
      riskScore: scoreForPd(pdJitter),
      riskBand: band,
      decision,
      createdAt: isoDaysAgo(daysAgo),
      reviewedBy: decision === "pending" ? undefined : pick(["A. Mwangi", "L. Kiptanui", "J. Ouma", "T. Nzioka"]),
      notes:
        decision === "referred"
          ? "Referred for human review — model output is decision support only."
          : undefined,
    };
  });
});

/* --------------------------- repayment timelines --------------------------- */

export const repaymentEvents: Record<string, RepaymentEvent[]> = Object.fromEntries(
  borrowers.map((b) => {
    const loan = loans.find((l) => l.borrowerId === b.id)!;
    const events: RepaymentEvent[] = [];
    const start = 240;
    events.push({
      id: `${loan.id}-issue`,
      date: isoDaysAgo(start),
      type: "issued",
      amount: loan.amount,
      loanId: loan.id,
      note: `Loan disbursed — ${loan.tenureMonths} month tenure`,
    });
    const instalments = Math.min(6, loan.tenureMonths);
    const perInstalment = Math.round(loan.amount / instalments);
    for (let i = 1; i <= instalments; i++) {
      const day = start - i * 30;
      const roll = rand();
      const type: RepaymentEvent["type"] =
        b.repayment.repaymentConsistency > 0.85
          ? "paid"
          : roll < b.repayment.repaymentConsistency
            ? "paid"
            : roll < b.repayment.repaymentConsistency + 0.25
              ? "late"
              : "missed";
      events.push({
        id: `${loan.id}-i${i}`,
        date: isoDaysAgo(Math.max(2, day)),
        type,
        amount: perInstalment,
        loanId: loan.id,
        note:
          type === "paid"
            ? `Instalment ${i} settled on schedule`
            : type === "late"
              ? `Instalment ${i} settled ${intBetween(3, 28)} days past due`
              : `Instalment ${i} not received`,
      });
    }
    if (loan.status === "completed") {
      events.push({
        id: `${loan.id}-done`,
        date: isoDaysAgo(5),
        type: "completed",
        amount: 0,
        loanId: loan.id,
        note: "Loan fully repaid and closed",
      });
    }
    return [b.id, events];
  }),
);

/* ------------------------------ assessments -------------------------------- */

export const assessments: Record<string, RiskAssessment[]> = Object.fromEntries(
  borrowers.map((b) => {
    const scored = scoreApplicant({
      age: b.age,
      monthlyIncome: b.monthlyIncome,
      employmentStatus: b.employmentStatus,
      dependants: b.dependants,
      residenceType: b.residenceType,
      loanAmount: Math.max(5000, b.outstandingBalance || b.monthlyIncome),
      tenureMonths: 12,
      purpose: "business_working_capital",
      transactionFrequency: b.transactions.monthlyTransactionCount,
      averageMonthlyInflow: b.transactions.averageMonthlyInflow,
      transactionVolatility: b.transactions.transactionVolatility,
      averageBalance: b.transactions.averageBalance,
      utilisationRatio: b.transactions.utilisationRatio,
      repaymentConsistency: b.repayment.repaymentConsistency,
      previousLoans: b.repayment.previousLoans,
      daysPastDue: b.repayment.daysPastDueMax,
      previousDefaults: b.repayment.previousDefaults,
      accountTenureMonths: b.accountTenureMonths,
      activeAccounts: b.activeAccounts,
    });

    const history: RiskAssessment[] = [0, 1, 2].map((i) => {
      const pd = Math.max(0.004, scored.probabilityOfDefault * (1 + i * 0.08 * (rand() > 0.5 ? 1 : -1)));
      const band = bandForPd(pd);
      return {
        id: `ASM-${b.id.split("-")[1]}-${3 - i}`,
        borrowerId: b.id,
        createdAt: isoDaysAgo(i * 45 + intBetween(1, 20)),
        probabilityOfDefault: i === 0 ? scored.probabilityOfDefault : pd,
        riskScore: i === 0 ? scored.riskScore : scoreForPd(pd),
        riskBand: i === 0 ? scored.riskBand : band,
        recommendation: recommendationFor(i === 0 ? scored.riskBand : band),
        modelVersion: i === 0 ? "xgb-1.4.0" : i === 1 ? "xgb-1.3.2" : "logreg-0.9.1",
        contributions: scored.contributions,
        confidence: scored.confidence,
      };
    });
    return [b.id, history];
  }),
);

/* --------------------------------- users ---------------------------------- */

export const users: User[] = [
  { id: "USR-001", name: "Amina Wachira", email: "amina.wachira@demo.trustline.io", organization: "Demo Credit Ltd", role: "admin", status: "active", lastLogin: isoDaysAgo(0) },
  { id: "USR-002", name: "Peter Kimeu", email: "peter.kimeu@demo.trustline.io", organization: "Demo Credit Ltd", role: "risk_manager", status: "active", lastLogin: isoDaysAgo(1) },
  { id: "USR-003", name: "Grace Onyango", email: "grace.onyango@demo.trustline.io", organization: "Demo Credit Ltd", role: "analyst", status: "active", lastLogin: isoDaysAgo(2) },
  { id: "USR-004", name: "Samuel Rotich", email: "samuel.rotich@demo.trustline.io", organization: "Sandbox Microfinance", role: "analyst", status: "active", lastLogin: isoDaysAgo(3) },
  { id: "USR-005", name: "Fatuma Ali", email: "fatuma.ali@demo.trustline.io", organization: "Sandbox Microfinance", role: "viewer", status: "invited", lastLogin: isoDaysAgo(14) },
  { id: "USR-006", name: "Brian Cheruiyot", email: "brian.cheruiyot@demo.trustline.io", organization: "Demo Credit Ltd", role: "viewer", status: "suspended", lastLogin: isoDaysAgo(41) },
  { id: "USR-007", name: "Njeri Kamau", email: "njeri.kamau@demo.trustline.io", organization: "Lakeview Sacco (Demo)", role: "risk_manager", status: "active", lastLogin: isoDaysAgo(1) },
  { id: "USR-008", name: "Dennis Muli", email: "dennis.muli@demo.trustline.io", organization: "Lakeview Sacco (Demo)", role: "analyst", status: "active", lastLogin: isoDaysAgo(6) },
];

export const organizations = [
  { id: "ORG-01", name: "Demo Credit Ltd", users: 4, activeAssessments: 128, plan: "Demo", status: "active" },
  { id: "ORG-02", name: "Sandbox Microfinance", users: 2, activeAssessments: 47, plan: "Demo", status: "active" },
  { id: "ORG-03", name: "Lakeview Sacco (Demo)", users: 2, activeAssessments: 62, plan: "Demo", status: "active" },
];

/* ------------------------------- audit log -------------------------------- */

const AUDIT_ACTIONS = [
  { action: "Risk assessment created", entity: "Assessment" },
  { action: "Application reviewed", entity: "Application" },
  { action: "Decision updated", entity: "Application" },
  { action: "Report generated", entity: "Report" },
  { action: "Model version changed", entity: "Model" },
  { action: "Risk threshold changed", entity: "Configuration" },
  { action: "User invited", entity: "User" },
  { action: "Export downloaded", entity: "Portfolio" },
];

export const auditEvents: AuditEvent[] = Array.from({ length: 64 }, (_, i) => {
  const a = pick(AUDIT_ACTIONS);
  const entityId =
    a.entity === "Application"
      ? pick(applications).id
      : a.entity === "Assessment"
        ? `ASM-${intBetween(10_400, 10_800)}-1`
        : a.entity === "Report"
          ? `RPT-00${intBetween(1, 5)}`
          : a.entity === "User"
            ? pick(users).id
            : a.entity === "Model"
              ? "xgb-1.4.0"
              : "CFG-RISK-BANDS";
  return {
    id: `EVT-${9000 + i}`,
    timestamp: isoDaysAgo(i * 0.31),
    user: pick(users).name,
    action: a.action,
    entity: a.entity,
    entityId,
    result: rand() > 0.94 ? "failure" : rand() > 0.97 ? "pending" : "success",
  };
});

/* ------------------------------ notifications ------------------------------ */

export const notifications: Notification[] = [
  { id: "NTF-1", title: "4 applications awaiting review", body: "Pending queue exceeds the 4-hour service target.", time: isoDaysAgo(0.02), severity: "warning", read: false },
  { id: "NTF-2", title: "High-risk exposure up 3.2pp", body: "Severe-band exposure grew week over week in the demo portfolio.", time: isoDaysAgo(0.2), severity: "critical", read: false },
  { id: "NTF-3", title: "Model evaluation completed", body: "xgb-1.4.0 nightly evaluation finished — AUC stable.", time: isoDaysAgo(0.6), severity: "info", read: false },
  { id: "NTF-4", title: "Cohort report ready", body: "Q1 2026 cohort comparison report is available.", time: isoDaysAgo(1.4), severity: "info", read: true },
  { id: "NTF-5", title: "Feature drift watch", body: "Transaction volatility PSI moved into the watch range.", time: isoDaysAgo(2.1), severity: "warning", read: true },
];

/* -------------------------- demo scenario borrowers ------------------------ */

export const scenarioBorrowers = {
  low: borrowers.find((b) => b.riskBand === "low")!,
  medium: borrowers.find((b) => b.riskBand === "medium")!,
  high: borrowers.find((b) => b.riskBand === "high")!,
  severe: borrowers.find((b) => b.riskBand === "severe")!,
};
