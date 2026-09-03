import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { ContributionBars } from "@/components/shared/ContributionBars";
import { scoreApplicant } from "@/lib/risk-engine";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Eye,
  FileCheck,
  Layers,
  Lock,
  PieChart,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  // Interactive mini simulation state for hero
  const [repaymentScore, setRepaymentScore] = useState(0.92);
  const [utilRatio, setUtilRatio] = useState(0.25);
  const [tenure, setTenure] = useState(36);
  const [volatility, setVolatility] = useState(0.18);

  const heroSimulation = scoreApplicant({
    age: 34,
    monthlyIncome: 75_000,
    employmentStatus: "self_employed",
    dependants: 2,
    residenceType: "owned",
    loanAmount: 40_000,
    tenureMonths: 12,
    purpose: "business_working_capital",
    transactionFrequency: 38,
    averageMonthlyInflow: 85_000,
    transactionVolatility: volatility,
    averageBalance: 24_000,
    utilisationRatio: utilRatio,
    repaymentConsistency: repaymentScore,
    previousLoans: 4,
    daysPastDue: 0,
    previousDefaults: 0,
    accountTenureMonths: tenure,
    activeAccounts: 2,
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Credit Risk Scoring • Alternative Data</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Make risk measurable. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                  Make decisions clearer.
                </span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
                Trustline combines mobile repayment behaviour, cash-flow patterns and borrower telemetry to estimate probability of default and provide explainable credit intelligence for modern lenders.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
                >
                  <span>1-Click Launch Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/auth/demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>Evaluation Sandbox</span>
                </Link>
              </div>

              {/* Highlights badge */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Transparent SHAP Explainability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Human-in-the-Loop Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Simulated KES Dataset</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulator Widget */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Scoring Simulator
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">XGBoost v1.4.0</span>
                </div>

                {/* Score Gauge */}
                <div className="py-2">
                  <ScoreGauge
                    score={heroSimulation.riskScore}
                    probabilityOfDefault={heroSimulation.probabilityOfDefault}
                    riskBand={heroSimulation.riskBand}
                    size="md"
                  />
                </div>

                {/* Interactive Sliders */}
                <div className="mt-4 space-y-3.5 border-t border-slate-800/80 pt-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Repayment Consistency</span>
                      <span className="font-mono text-blue-400">{Math.round(repaymentScore * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="0.99"
                      step="0.01"
                      value={repaymentScore}
                      onChange={(e) => setRepaymentScore(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Cashflow Utilisation Ratio</span>
                      <span className="font-mono text-amber-400">{Math.round(utilRatio * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.95"
                      step="0.01"
                      value={utilRatio}
                      onChange={(e) => setUtilRatio(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Mobile Account Tenure</span>
                      <span className="font-mono text-emerald-400">{tenure} months</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="60"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-950/70 p-2.5 text-[11px] text-slate-400 border border-slate-800/60">
                  <span className="font-semibold text-slate-300">Model Recommendation: </span>
                  {heroSimulation.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Credit Risk Problem Section */}
      <section className="border-t border-slate-800/80 bg-slate-900/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              The Underwriting Dilemma
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Thin-file borrowers are invisible to legacy scoring models
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Traditional credit reference bureaus rely heavily on historical formal bank debt. When micro-entrepreneurs, traders, and smallholders lack formal borrowing records, lenders face high default uncertainty and high rejection rates.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Blind-Spot Underwriting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rejection of creditworthy applicants due to absence of formal credit histories, suppressing financial inclusion across emerging markets.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Black-Box AI Skepticism</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Opaque automated models that spit out credit decisions without explaining why a borrower was approved or flagged create severe regulatory risk.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Unmonitored Risk Creep</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Portfolio degradation driven by undetected cash-flow volatility shocks before the first 30-day delinquency occurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Step Workflow Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Architecture & Workflow
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              From Raw Behaviour to Explainable Credit Decisions
            </h2>
            <p className="text-sm text-slate-400">
              A continuous, evidence-grounded intelligence pipeline designed for digital lending institutions.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Alternative Data Ingestion", desc: "Ingests mobile-money transactions, inflow velocity, repayment consistency and utility bill records.", icon: Zap },
              { step: "02", title: "Feature Engineering", desc: "Computes non-linear behavioural metrics like transaction volatility, cash flow utilisation, and tenure duration.", icon: Layers },
              { step: "03", title: "Calibrated Risk Modeling", desc: "XGBoost and benchmark Logistic Regression scorecards estimate calibrated Probability of Default (PD).", icon: Cpu },
              { step: "04", title: "Score & Band Assignment", desc: "Maps PD onto a standard 300–900 score and assigns semantic bands: Low, Medium, High, and Severe Risk.", icon: BarChart3 },
              { step: "05", title: "SHAP Explainability", desc: "Deconstructs individual predictions into human-readable feature contribution waterfalls with signed directional impact.", icon: Eye },
              { step: "06", title: "Human Decision Support", desc: "Underwriters review evidence-based recommendations to approve, refer, or reject with full audit tracking.", icon: FileCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">{item.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Model Benchmark & SHAP Section */}
      <section className="border-t border-slate-800/80 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Model Governance & AI Transparency
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Explainable ML that empowers underwriters, not replaces them
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Trustline provides feature attributions for every single assessment. Underwriters see the exact contribution of each transaction metric—eliminating black-box opacity and ensuring adherence to responsible lending principles.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white">AUC 0.884 vs 0.768 Baseline: </strong>
                    <span className="text-slate-400">XGBoost model demonstrates high discriminatory power over standard scorecards.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white">SHAP Attribution Vectors: </strong>
                    <span className="text-slate-400">Mathematical contributions identify exactly which behavioural metrics reduced or increased risk.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <strong className="text-white">Population Stability Index (PSI): </strong>
                    <span className="text-slate-400">Active telemetry monitors covariate feature drift in real-time.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/explainability"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  <span>Explore SHAP Explainability Architecture</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl">
                <ContributionBars
                  contributions={heroSimulation.contributions}
                  maxBars={5}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Shield className="h-3.5 w-3.5" />
            <span>Preloaded Evaluation Sandbox Active</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to test credit risk intelligence in action?
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300">
            Launch the Evaluation Sandbox with full supervisor permissions. Explore 52 synthetic borrowers, automated underwriting workflows, portfolio risk distribution, and model governance dashboards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2.5 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
            >
              <span>1-Click Launch Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/product"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-8 py-4 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <span>Explore Product Suite</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
