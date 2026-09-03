import type {
  Borrower,
  Application,
  Loan,
  RepaymentEvent,
  RiskBand,
  LoanPurpose,
  TransactionBehaviour,
  RepaymentBehaviour,
} from "@/lib/types";
import { calculateRiskAssessment } from "@/lib/risk-engine";

// 4 Economic Segments
export type SegmentType = "salaried" | "micro_business" | "informal_trader" | "smallholder_farmer";

// Kenyan Counties
export const KENYAN_COUNTIES = [
  "Nairobi",
  "Mombasa",
  "Kiambu",
  "Nakuru",
  "Kisumu",
  "Eldoret (Uasin Gishu)",
  "Machakos",
  "Nyeri",
  "Meru",
  "Kajiado",
  "Kilifi",
  "Kakamega",
];

export const FIRST_NAMES = [
  "Samuel", "Mary", "David", "Grace", "Peter", "Faith", "Joseph", "Joyce",
  "John", "Agnes", "Daniel", "Beatrice", "Michael", "Esther", "Stephen", "Mercy",
  "Francis", "Winnie", "George", "Rose", "Paul", "Caroline", "James", "Lilian",
  "Kelvin", "Purity", "Dennis", "Jane", "Brian", "Alice", "Kennedy", "Hellen",
  "Antony", "Sarah", "Victor", "Gladys", "Patrick", "Eunice", "Geoffrey", "Lucy",
];

export const LAST_NAMES = [
  "Kipchoge", "Wanjiku", "Ochieng", "Muthoni", "Mwangi", "Achieng", "Kariuki",
  "Wambui", "Kamau", "Otieno", "Njoroge", "Nyambura", "Cheruiyot", "Chebet",
  "Kiplagat", "Mutua", "Ndung'u", "Omondi", "Maina", "Koech", "Karanja",
  "Wafula", "Simiyu", "Barasa", "Githinji", "Njeri", "Kimani", "Kiprono",
];

export const LOAN_PURPOSES: LoanPurpose[] = [
  "business_working_capital",
  "school_fees",
  "agriculture_inputs",
  "medical",
  "asset_purchase",
  "emergency",
];

/**
 * Seeded pseudo-random generator (Linear Congruential Generator) for reproducible synthetic datasets
 */
export class SeededRandom {
  private seed: number;

  constructor(seed = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  intBetween(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  floatBetween(min: number, max: number, decimals = 2): number {
    const val = this.next() * (max - min) + min;
    return parseFloat(val.toFixed(decimals));
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  sampleLogNormal(mean: number, stdDev: number): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.max(1e-6, this.next());
    const u2 = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.exp(mean + stdDev * z);
  }
}

/**
 * Generate synthetic 12-month transaction cashflow history
 */
export function generateMonthlyCashflows(
  rng: SeededRandom,
  baseInflow: number,
  volatility: number,
  utilisationRatio: number,
) {
  const months = [
    "Mar 2025", "Apr 2025", "May 2025", "Jun 2025",
    "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
    "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026",
  ];

  return months.map((month) => {
    // Volatility perturbation
    const delta = (rng.next() - 0.5) * 2 * volatility;
    const inflow = Math.round(Math.max(5000, baseInflow * (1 + delta)));
    const outflow = Math.round(inflow * utilisationRatio * (1 + (rng.next() - 0.5) * 0.2));
    const count = rng.intBetween(12, 85);
    return {
      month,
      inflow,
      outflow,
      count,
      volatility: parseFloat((volatility * (0.8 + rng.next() * 0.4)).toFixed(2)),
    };
  });
}

/**
 * Generate full synthetic dataset of borrowers, loans, repayments, and applications
 */
export function generateSyntheticDataset(count = 52, seed = 101) {
  const rng = new SeededRandom(seed);
  const borrowers: Borrower[] = [];
  const loans: Loan[] = [];
  const repayments: RepaymentEvent[] = [];
  const applications: Application[] = [];

  const segmentArchetypes: Record<
    SegmentType,
    {
      incomeRange: [number, number];
      volatilityRange: [number, number];
      utilisationRange: [number, number];
      consistencyRange: [number, number];
      defaultProbRange: [number, number];
    }
  > = {
    salaried: {
      incomeRange: [45000, 180000],
      volatilityRange: [0.08, 0.22],
      utilisationRange: [0.35, 0.65],
      consistencyRange: [0.85, 0.99],
      defaultProbRange: [0.015, 0.065],
    },
    micro_business: {
      incomeRange: [30000, 140000],
      volatilityRange: [0.25, 0.45],
      utilisationRange: [0.45, 0.75],
      consistencyRange: [0.70, 0.92],
      defaultProbRange: [0.045, 0.14],
    },
    informal_trader: {
      incomeRange: [20000, 90000],
      volatilityRange: [0.35, 0.65],
      utilisationRange: [0.55, 0.85],
      consistencyRange: [0.55, 0.85],
      defaultProbRange: [0.08, 0.24],
    },
    smallholder_farmer: {
      incomeRange: [15000, 85000],
      volatilityRange: [0.45, 0.75],
      utilisationRange: [0.50, 0.88],
      consistencyRange: [0.50, 0.80],
      defaultProbRange: [0.12, 0.35],
    },
  };

  const segments: SegmentType[] = [
    "salaried",
    "micro_business",
    "informal_trader",
    "smallholder_farmer",
  ];

  for (let i = 1; i <= count; i++) {
    const id = `BW-${String(i).padStart(4, "0")}`;
    const name = `${rng.choice(FIRST_NAMES)} ${rng.choice(LAST_NAMES)}`;
    const segment = segments[(i - 1) % segments.length];
    const archetype = segmentArchetypes[segment];

    const age = rng.intBetween(23, 62);
    const county = rng.choice(KENYAN_COUNTIES);
    const residenceType = rng.choice(["owned", "rented", "family"] as const);
    const employmentStatus =
      segment === "salaried"
        ? "employed"
        : segment === "micro_business"
          ? "business_owner"
          : segment === "informal_trader"
            ? "self_employed"
            : "casual";
    const dependants = rng.intBetween(0, 5);

    const monthlyIncome = rng.intBetween(archetype.incomeRange[0], archetype.incomeRange[1]);
    const volatility = rng.floatBetween(archetype.volatilityRange[0], archetype.volatilityRange[1]);
    const utilisationRatio = rng.floatBetween(archetype.utilisationRange[0], archetype.utilisationRange[1]);
    const consistency = rng.floatBetween(archetype.consistencyRange[0], archetype.consistencyRange[1]);

    const accountTenureMonths = rng.intBetween(12, 96);
    const activeAccounts = rng.intBetween(1, 4);

    const previousLoans = rng.intBetween(1, 8);
    const previousDefaults = consistency < 0.65 ? rng.intBetween(1, 2) : 0;
    const daysPastDueMax = previousDefaults > 0 ? rng.intBetween(35, 90) : consistency < 0.8 ? rng.intBetween(5, 25) : 0;

    const monthly = generateMonthlyCashflows(rng, monthlyIncome, volatility, utilisationRatio);
    const averageMonthlyInflow = monthlyIncome;
    const averageMonthlyOutflow = Math.round(monthlyIncome * utilisationRatio);
    const averageBalance = Math.round(monthlyIncome * (1 - utilisationRatio) * 0.8);

    const transactions: TransactionBehaviour = {
      monthlyTransactionCount: rng.intBetween(25, 90),
      averageTransactionAmount: Math.round(monthlyIncome / 35),
      transactionVolatility: volatility,
      averageMonthlyInflow,
      averageMonthlyOutflow,
      averageBalance,
      utilisationRatio,
      monthly,
    };

    const repayment: RepaymentBehaviour = {
      repaymentConsistency: consistency,
      previousLoans,
      daysPastDueMax,
      averageDaysPastDue: Math.round(daysPastDueMax * 0.4),
      previousDefaults,
      onTimeRate: consistency,
    };

    // Calculate preliminary score using transparent engine
    const assessment = calculateRiskAssessment({
      age,
      monthlyIncome,
      employmentStatus,
      dependants,
      residenceType,
      loanAmount: Math.round(monthlyIncome * 0.8),
      tenureMonths: 6,
      purpose: "business_working_capital",
      transactionFrequency: transactions.monthlyTransactionCount,
      averageMonthlyInflow,
      transactionVolatility: volatility,
      averageBalance,
      utilisationRatio,
      repaymentConsistency: consistency,
      previousLoans,
      daysPastDue: daysPastDueMax,
      previousDefaults,
      accountTenureMonths,
      activeAccounts,
    });

    const activeLoansCount = rng.choice([0, 1, 1, 2]);
    const outstandingBalance = activeLoansCount > 0 ? Math.round(monthlyIncome * 0.6) : 0;

    const borrower: Borrower = {
      id,
      name,
      segment,
      age,
      county,
      residenceType,
      employmentStatus,
      dependants,
      monthlyIncome,
      accountTenureMonths,
      activeAccounts,
      joinedAt: new Date(Date.now() - accountTenureMonths * 30 * 86400000).toISOString(),
      riskScore: assessment.riskScore,
      probabilityOfDefault: assessment.probabilityOfDefault,
      riskBand: assessment.riskBand,
      activeLoans: activeLoansCount,
      totalBorrowed: Math.round(monthlyIncome * previousLoans * 0.8),
      outstandingBalance,
      lastAssessment: new Date(Date.now() - rng.intBetween(1, 45) * 86400000).toISOString(),
      transactions,
      repayment,
    };

    borrowers.push(borrower);

    // Create facility loans
    const loanId = `LN-${String(i).padStart(4, "0")}`;
    const loanAmount = Math.round(monthlyIncome * rng.floatBetween(0.5, 1.8));
    const purpose = rng.choice(LOAN_PURPOSES);

    const loan: Loan = {
      id: loanId,
      borrowerId: id,
      amount: loanAmount,
      tenureMonths: rng.choice([3, 6, 9, 12]),
      purpose,
      issuedAt: new Date(Date.now() - rng.intBetween(30, 240) * 86400000).toISOString(),
      status: borrower.riskBand === "severe" && rng.next() > 0.6 ? "defaulted" : activeLoansCount > 0 ? "active" : "completed",
      outstanding: outstandingBalance,
      interestRate: rng.choice([0.14, 0.16, 0.18, 0.22]),
    };
    loans.push(loan);

    // Create application
    const appId = `APP-${String(i).padStart(4, "0")}`;
    const decision =
      borrower.riskBand === "low"
        ? "approved"
        : borrower.riskBand === "medium"
          ? rng.choice(["approved", "pending", "referred"] as const)
          : borrower.riskBand === "high"
            ? rng.choice(["referred", "pending", "rejected"] as const)
            : "rejected";

    applications.push({
      id: appId,
      borrowerId: id,
      borrowerName: name,
      loanId,
      amount: loanAmount,
      tenureMonths: loan.tenureMonths,
      purpose,
      probabilityOfDefault: borrower.probabilityOfDefault,
      riskScore: borrower.riskScore,
      riskBand: borrower.riskBand,
      decision,
      createdAt: new Date(Date.now() - rng.intBetween(1, 60) * 86400000).toISOString(),
      reviewedBy: decision !== "pending" ? "Dr. Sarah Kimani" : undefined,
      notes: decision === "approved" ? "Strong cashflow stability and verified mobile receipts." : decision === "rejected" ? "Elevated default probability and significant recent DPD." : undefined,
    });

    // Create repayment event history
    for (let r = 1; r <= 4; r++) {
      const isLate = consistency < 0.75 && rng.next() > 0.5;
      const isMissed = previousDefaults > 0 && r === 4;
      repayments.push({
        id: `REP-${i}-${r}`,
        loanId,
        date: new Date(Date.now() - (5 - r) * 30 * 86400000).toISOString(),
        type: isMissed ? "missed" : isLate ? "late" : "paid",
        amount: Math.round(loanAmount / 4),
        note: isMissed
          ? "Installment overdue > 30 days"
          : isLate
            ? "Paid 8 days late via M-Pesa Till"
            : "On-time M-Pesa automatic deduction",
      });
    }
  }

  return { borrowers, loans, repayments, applications };
}
