import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ContributionBars } from "@/components/shared/ContributionBars";
import { scoreApplicant } from "@/lib/risk-engine";
import { ArrowRight, CheckCircle2, Cpu, Eye, Info, Lock, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/explainability")({
  component: ExplainabilityPage,
});

function ExplainabilityPage() {
  const sampleLowRisk = scoreApplicant({
    age: 36,
    monthlyIncome: 95_000,
    employmentStatus: "employed",
    dependants: 1,
    residenceType: "owned",
    loanAmount: 50_000,
    tenureMonths: 12,
    purpose: "business_working_capital",
    transactionFrequency: 45,
    averageMonthlyInflow: 110_000,
    transactionVolatility: 0.12,
    averageBalance: 32_000,
    utilisationRatio: 0.22,
    repaymentConsistency: 0.98,
    previousLoans: 5,
    daysPastDue: 0,
    previousDefaults: 0,
    accountTenureMonths: 48,
    activeAccounts: 3,
  });

  const sampleHighRisk = scoreApplicant({
    age: 28,
    monthlyIncome: 35_000,
    employmentStatus: "casual",
    dependants: 3,
    residenceType: "rented",
    loanAmount: 60_000,
    tenureMonths: 6,
    purpose: "emergency",
    transactionFrequency: 18,
    averageMonthlyInflow: 38_000,
    transactionVolatility: 0.58,
    averageBalance: 4_000,
    utilisationRatio: 0.88,
    repaymentConsistency: 0.52,
    previousLoans: 2,
    daysPastDue: 35,
    previousDefaults: 1,
    accountTenureMonths: 10,
    activeAccounts: 1,
  });

  return (
    <PublicLayout>
      {/* Header */}
      <section className="pt-16 pb-20 border-b border-slate-800/80 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Responsible AI & Interpretability
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Transparent SHAP Explainability
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Why Trustline never relies on black-box scoring. Every risk prediction is deconstructed into exact feature contributions with signed directional impacts.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Side by side low risk vs high risk comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Low Risk Profile */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400 border border-emerald-500/20">
                    Low Risk Profile
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Score: {sampleLowRisk.riskScore} (PD: 1.8%)</h3>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Positive feature contributions dominate the logit sum. The applicant's high repayment consistency (98%) and long account tenure (48 mos) significantly compress estimated default probability.
              </p>

              <ContributionBars contributions={sampleLowRisk.contributions} maxBars={5} />
            </div>

            {/* High Risk Profile */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-400 border border-rose-500/20">
                    Severe Risk Profile
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Score: {sampleHighRisk.riskScore} (PD: 44.2%)</h3>
                </div>
                <Eye className="h-6 w-6 text-rose-400" />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Adverse signals compound: high cash flow utilisation (88%), recent 35-day delinquency, and transaction volatility severely elevate the default probability, triggering a model recommendation for senior credit review.
              </p>

              <ContributionBars contributions={sampleHighRisk.contributions} maxBars={5} />
            </div>
          </div>

          {/* Explainability Principles */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
              Our 4 Pillars of Explainable Credit Risk
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span>Mathematical Local & Global SHAP Consistency</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  SHAP guarantees additivity: the sum of individual feature contributions plus the baseline logit exactly equals the model's final score output.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span>Actionable Adverse Action Notices</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  When an application is rejected or referred, the system generates specific, actionable reasons (e.g. "Cashflow utilisation is too high relative to loan size") rather than generic rejection codes.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span>Fair Lending & Demographic Non-Discrimination</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  Protected attributes like gender, tribe, or religious affiliation are strictly excluded from all model training sets to prevent algorithmic bias.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  <span>Human-in-the-Loop Override Capability</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  The model recommendation is decision support. Underwriters possess full authority to review supplementary collateral or business documentation and record justified overrides.
                </p>
              </div>
            </div>

            <div className="text-center pt-6">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-blue-500 transition-all"
              >
                <span>Launch the Underwriting Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
