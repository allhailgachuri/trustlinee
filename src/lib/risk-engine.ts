import type { FeatureContribution, RiskAssessmentInput, RiskBand } from "./types";

/**
 * Demonstration scoring engine.
 *
 * This is a transparent logistic-style approximation used ONLY to make the demo
 * behave coherently. It is not a trained model and produces no real-world
 * predictive claim. When the FastAPI service is connected, `POST /api/v1/risk/score`
 * replaces this function and SHAP values replace `contributions`.
 */

export const RISK_THRESHOLDS = {
  low: 0.05, // PD <= 5%
  medium: 0.12, // PD <= 12%
  high: 0.25, // PD <= 25%, above that = severe
};

export const bandForPd = (pd: number): RiskBand => {
  if (pd <= RISK_THRESHOLDS.low) return "low";
  if (pd <= RISK_THRESHOLDS.medium) return "medium";
  if (pd <= RISK_THRESHOLDS.high) return "high";
  return "severe";
};

/** Maps probability of default onto a 300–900 scorecard range. */
export const scoreForPd = (pd: number) =>
  Math.round(Math.max(300, Math.min(900, 900 - Math.log10(1 + pd * 999) * 200)));

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const FEATURE_META: Record<string, { label: string; goodWhenLow: boolean }> = {
  repaymentConsistency: { label: "Repayment consistency", goodWhenLow: false },
  utilisationRatio: { label: "Utilisation ratio", goodWhenLow: true },
  transactionVolatility: { label: "Transaction volatility", goodWhenLow: true },
  accountTenureMonths: { label: "Account tenure", goodWhenLow: false },
  daysPastDue: { label: "Days past due", goodWhenLow: true },
  previousDefaults: { label: "Previous defaults", goodWhenLow: true },
  loanToIncome: { label: "Loan-to-income", goodWhenLow: true },
  transactionFrequency: { label: "Transaction frequency", goodWhenLow: false },
};

export interface ScoredResult {
  probabilityOfDefault: number;
  riskScore: number;
  riskBand: RiskBand;
  recommendation: string;
  confidence: number;
  contributions: FeatureContribution[];
}

export const recommendationFor = (band: RiskBand): string =>
  ({
    low: "Suitable for standard review",
    medium: "Suitable for review with additional verification",
    high: "Refer for enhanced manual review before any offer",
    severe: "Multiple adverse signals — escalate to senior credit review",
  })[band];

export function scoreApplicant(input: RiskAssessmentInput): ScoredResult {
  const loanToIncome = clamp01(input.loanAmount / Math.max(1, input.monthlyIncome * 6));

  const terms: { key: string; weight: number; x: number; display: string }[] = [
    {
      key: "repaymentConsistency",
      weight: -2.6,
      x: clamp01(input.repaymentConsistency),
      display: `${Math.round(input.repaymentConsistency * 100)}%`,
    },
    {
      key: "utilisationRatio",
      weight: 2.1,
      x: clamp01(input.utilisationRatio),
      display: `${Math.round(input.utilisationRatio * 100)}%`,
    },
    {
      key: "transactionVolatility",
      weight: 1.7,
      x: clamp01(input.transactionVolatility),
      display: input.transactionVolatility.toFixed(2),
    },
    {
      key: "accountTenureMonths",
      weight: -1.4,
      x: clamp01(input.accountTenureMonths / 60),
      display: `${input.accountTenureMonths} months`,
    },
    {
      key: "daysPastDue",
      weight: 2.4,
      x: clamp01(input.daysPastDue / 90),
      display: `${input.daysPastDue} days`,
    },
    {
      key: "previousDefaults",
      weight: 1.9,
      x: clamp01(input.previousDefaults / 3),
      display: `${input.previousDefaults}`,
    },
    { key: "loanToIncome", weight: 1.3, x: loanToIncome, display: `${Math.round(loanToIncome * 100)}%` },
    {
      key: "transactionFrequency",
      weight: -0.9,
      x: clamp01(input.transactionFrequency / 60),
      display: `${input.transactionFrequency}/month`,
    },
  ];

  const intercept = -1.15;
  const logit = terms.reduce((acc, t) => acc + t.weight * t.x, intercept);
  const pd = clamp01(1 / (1 + Math.exp(-logit)));

  const contributions: FeatureContribution[] = terms
    .map((t) => {
      const contribution = t.weight * t.x;
      const meta = FEATURE_META[t.key]!;
      const increases = contribution > 0;
      return {
        feature: t.key,
        label: meta.label,
        value: t.display,
        contribution,
        direction: (increases ? "increases_risk" : "reduces_risk") as FeatureContribution["direction"],
        interpretation: interpret(meta.label, Math.abs(contribution), increases),
      };
    })
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const band = bandForPd(pd);
  return {
    probabilityOfDefault: pd,
    riskScore: scoreForPd(pd),
    riskBand: band,
    recommendation: recommendationFor(band),
    confidence: 0.78 + (1 - Math.abs(pd - 0.5)) * 0.15,
    contributions,
  };
}

function interpret(label: string, magnitude: number, increasesRisk: boolean) {
  const strength = magnitude > 1.2 ? "Strong" : magnitude > 0.5 ? "Moderate" : "Mild";
  return increasesRisk ? `${strength} concern — ${label.toLowerCase()} raises estimated default risk` : `${strength} positive signal — ${label.toLowerCase()} lowers estimated default risk`;
}
