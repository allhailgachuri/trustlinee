import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArrowRight, CheckCircle2, Cpu, Database, FileText, Layers, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const steps = [
    {
      step: "01",
      title: "Data Collection & Alternative Telemetry",
      badge: "Ingestion",
      description:
        "The underwriting journey begins by gathering both conventional application fields and alternative digital records: mobile wallet cash flows, transaction frequencies, account tenure, and utility bill histories.",
      bullets: [
        "Eliminates reliance on formal multi-year credit bureau footprints",
        "Supports digital MSMEs, gig economy workers, and agricultural smallholders",
        "Pre-processes noisy timestamps, irregular deposits, and seasonal surges",
      ],
      icon: Database,
    },
    {
      step: "02",
      title: "Feature Engineering & Volatility Modeling",
      badge: "Transformation",
      description:
        "Raw transactional telemetry is transformed into predictive risk indicators: Repayment Consistency Index, Inflow Volatility (standard deviation / mean), and Cash Flow Utilisation Ratio.",
      bullets: [
        "Normalizes irregular micro-deposits into predictable weekly cashflow profiles",
        "Flags high utilisation ratios before overdue notices occur",
        "Calculates true repayment velocity across multi-channel loan cycles",
      ],
      icon: Layers,
    },
    {
      step: "03",
      title: "Machine Learning Scoring & PD Estimation",
      badge: "Inference",
      description:
        "Engineered features are scored by calibrated Gradient Boosted Trees (XGBoost) and Logistic Scorecards to produce a rigorous Probability of Default (PD) between 0% and 100%.",
      bullets: [
        "Trained on historical emerging-market credit cohorts",
        "Probability of Default mapped onto a standard 300–900 credit scorecard range",
        "Assigns clear semantic risk bands: Low (PD <= 5%), Medium (5–12%), High (12–25%), and Severe (> 25%)",
      ],
      icon: Cpu,
    },
    {
      step: "04",
      title: "SHAP Explainability & Attribution Generation",
      badge: "Transparency",
      description:
        "Instead of returning an opaque score, the engine executes SHAP (SHapley Additive exPlanations) to isolate exactly how each feature moved the baseline risk up or down.",
      bullets: [
        "Identifies positive signals (e.g. 98% repayment consistency lowers PD by -2.6)",
        "Isolates negative concerns (e.g. 78% utilisation increases PD by +2.1)",
        "Generates natural-language rationale for credit committee review",
      ],
      icon: Sparkles,
    },
    {
      step: "05",
      title: "Human Underwriter Decision Support",
      badge: "Decisioning",
      description:
        "Credit analysts evaluate the holistic application in the Trustline underwriting console: reviewing the score, timeline, transaction graph, and SHAP vectors before finalizing the decision.",
      bullets: [
        "The model recommends: 'Standard Review', 'Additional Verification', or 'Senior Escalation'",
        "Underwriter can Approve, Refer for Committee Review, or Reject with custom notes",
        "Every action is logged in an immutable, searchable compliance audit trail",
      ],
      icon: ShieldCheck,
    },
  ];

  return (
    <PublicLayout>
      <section className="pt-16 pb-20 border-b border-slate-800/80 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            End-to-End Methodology
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Trustline Scores Credit Risk
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            A step-by-step walkthrough of how raw financial behaviour is ingested, engineered into predictive features, and converted into explainable underwriting decisions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative rounded-3xl border border-slate-800 bg-slate-900/70 p-8 sm:p-10 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 font-mono font-bold text-lg">
                      {s.step}
                    </div>
                    <div>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-400 border border-blue-500/20">
                        {s.badge}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{s.title}</h2>
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-slate-600 hidden sm:block" />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">{s.description}</p>

                <div className="mt-6 space-y-2.5 rounded-2xl bg-slate-950/60 p-5 border border-slate-800/80">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Key Mechanics
                  </div>
                  {s.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="text-center pt-8">
            <Link
              to="/app/risk-assessment"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl hover:bg-blue-500 transition-all active:scale-95"
            >
              <span>Test the Risk Scoring Engine Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
