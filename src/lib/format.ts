import type { Decision, LoanPurpose, RiskBand, UserRole } from "./types";

export const KES = (value: number, compact = false) =>
  compact && Math.abs(value) >= 1_000_000
    ? `KES ${(value / 1_000_000).toFixed(1)}M`
    : compact && Math.abs(value) >= 10_000
      ? `KES ${(value / 1_000).toFixed(0)}K`
      : `KES ${Math.round(value).toLocaleString("en-KE")}`;

export const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export const num = (value: number, digits = 0) =>
  value.toLocaleString("en-KE", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return shortDate(iso);
};

export const RISK_BAND_LABEL: Record<RiskBand, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
  severe: "Very high risk",
};

export const RISK_BAND_ORDER: RiskBand[] = ["low", "medium", "high", "severe"];

/** Tailwind token classes per risk band — semantic tokens only. */
export const riskBandClasses = (band: RiskBand) =>
  ({
    low: "bg-risk-low-soft text-risk-low border-risk-low/30",
    medium: "bg-risk-medium-soft text-risk-medium border-risk-medium/30",
    high: "bg-risk-high-soft text-risk-high border-risk-high/30",
    severe: "bg-risk-severe-soft text-risk-severe border-risk-severe/30",
  })[band];

export const riskBandVar = (band: RiskBand) =>
  ({
    low: "var(--color-risk-low)",
    medium: "var(--color-risk-medium)",
    high: "var(--color-risk-high)",
    severe: "var(--color-risk-severe)",
  })[band];

export const DECISION_LABEL: Record<Decision, string> = {
  approved: "Approved",
  rejected: "Rejected",
  pending: "Pending",
  referred: "Referred for review",
};

export const decisionClasses = (decision: Decision) =>
  ({
    approved: "bg-risk-low-soft text-risk-low border-risk-low/30",
    rejected: "bg-risk-severe-soft text-risk-severe border-risk-severe/30",
    pending: "bg-muted text-muted-foreground border-border",
    referred: "bg-brand-soft text-brand border-brand/30",
  })[decision];

export const PURPOSE_LABEL: Record<LoanPurpose, string> = {
  business_working_capital: "Business working capital",
  school_fees: "School fees",
  agriculture_inputs: "Agriculture inputs",
  medical: "Medical",
  asset_purchase: "Asset purchase",
  emergency: "Emergency",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  risk_manager: "Risk Manager",
  analyst: "Analyst",
  viewer: "Viewer",
};

export const SEGMENT_LABEL: Record<string, string> = {
  salaried: "Salaried",
  micro_business: "Micro business",
  informal_trader: "Informal trader",
  smallholder_farmer: "Smallholder farmer",
};

export const EMPLOYMENT_LABEL: Record<string, string> = {
  employed: "Employed",
  self_employed: "Self-employed",
  casual: "Casual work",
  business_owner: "Business owner",
};

export const RESIDENCE_LABEL: Record<string, string> = {
  owned: "Owned",
  rented: "Rented",
  family: "Family home",
};

export const titleCase = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
