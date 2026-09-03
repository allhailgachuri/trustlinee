import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArrowRight, CheckCircle2, Database, Info, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alternative-data")({
  component: AlternativeDataPage,
});

function AlternativeDataPage() {
  const [selectedSignal, setSelectedSignal] = useState(0);

  const signals = [
    {
      name: "Repayment Consistency Index",
      badge: "Primary Signal • 28% Weight",
      summary: "Measures on-time completion across prior short-tenure loan cycles and utility obligations.",
      whyItMatters:
        "Borrowers who consistently settle micro-commitments on or before schedule demonstrate strong behavioral discipline, regardless of formal payslip verification.",
      formula: "On-time installments / Total expected installments over 12-month trailing window.",
      coverage: "96.4% in demonstration portfolio",
      dataSources: "Mobile-money statements, microfinance records, digital wallet transaction ledgers",
      predictiveImpact: "Strong positive signal (PD reduction up to -2.6 logit points)",
    },
    {
      name: "Mobile-Money Inflow Volatility",
      badge: "Cashflow Metric • 18% Weight",
      summary: "Measures standard deviation of weekly revenue deposits relative to monthly mean volume.",
      whyItMatters:
        "High volatility indicates unpredictable seasonal cashflow shocks, identifying when an informal trader may experience temporary liquidity stress.",
      formula: "StdDev(Weekly Inflow) / Mean(Monthly Inflow) over trailing 6 months.",
      coverage: "94.2% across active borrowers",
      dataSources: "Till numbers, Paybill statements, P2P incoming transfers",
      predictiveImpact: "Moderate concern when volatility exceeds 0.45",
    },
    {
      name: "Cash Flow Utilisation Ratio",
      badge: "Liquidity Indicator • 16% Weight",
      summary: "Proportion of incoming cash immediately committed to mandatory outgoing transfers and expenses.",
      whyItMatters:
        "When utilization surpasses 75%, the borrower has very little buffer left to absorb unexpected medical or business emergencies without missing loan installments.",
      formula: "Total Monthly Outflows / Total Monthly Verifiable Inflow.",
      coverage: "91.8% coverage",
      dataSources: "Bank account aggregators, digital wallet ledger summaries",
      predictiveImpact: "Leading delinquency indicator 45 days before first missed payment",
    },
    {
      name: "Account Tenure Duration",
      badge: "Stability Signal • 12% Weight",
      summary: "Total continuous active operational lifespan of the primary mobile-money or digital wallet account.",
      whyItMatters:
        "Longer tenure establishes persistent commercial and social identity in the financial ecosystem, correlating with lower default rates across emerging market demographics.",
      formula: "Months since initial registered KYC event or first verifiable transaction.",
      coverage: "100% available at origination",
      dataSources: "Telco KYC timestamp, banking origination date",
      predictiveImpact: "Matures risk tolerance; accounts > 24 months show 4.2x higher reliability",
    },
    {
      name: "Historical Delinquency Velocity",
      badge: "Adverse Signal • 22% Weight",
      summary: "Maximum days past due (DPD) recorded across any previous credit facility within 24 months.",
      whyItMatters:
        "Recent 30+ DPD episodes flag chronic distress, prompting the model to recommend enhanced human underwriter review.",
      formula: "Max(Days Past Due) across historical loan schedules.",
      coverage: "89.5% coverage",
      dataSources: "Historical lending engine database, partner SACCO records",
      predictiveImpact: "Significant risk escalations (+2.4 logit points for DPD > 30)",
    },
  ];

  const current = signals[selectedSignal]!;

  return (
    <PublicLayout>
      {/* Header */}
      <section className="pt-16 pb-20 border-b border-slate-800/80 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Alternative Credit Telemetry
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Alternative Data Signals That Power Trustline
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Learn how non-traditional data points like cash-flow velocity, repayment consistency, and volatility are engineered into predictive credit risk intelligence.
          </p>
        </div>
      </section>

      {/* Interactive Signal Explorer */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar list of signals */}
            <div className="lg:col-span-5 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">
                Select Feature Signal
              </h3>
              {signals.map((s, idx) => {
                const active = selectedSignal === idx;
                return (
                  <button
                    key={s.name}
                    onClick={() => setSelectedSignal(idx)}
                    className={cn(
                      "w-full text-left rounded-2xl p-4.5 transition-all border",
                      active
                        ? "bg-blue-600/15 border-blue-500/40 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200",
                    )}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{s.name}</span>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded",
                          active ? "bg-blue-500/20 text-blue-300" : "bg-slate-800 text-slate-400",
                        )}
                      >
                        {s.badge.split("•")[1] || "Signal"}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{s.summary}</p>
                  </button>
                );
              })}
            </div>

            {/* Detailed Signal View */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-6 shadow-2xl backdrop-blur-xl">
                <div>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                    {current.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">{current.name}</h2>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{current.summary}</p>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Why it matters in credit risk
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{current.whyItMatters}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400">Mathematical Formulation</div>
                      <div className="mt-1 font-mono text-xs text-blue-400">{current.formula}</div>
                    </div>
                    <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400">Predictive Contribution</div>
                      <div className="mt-1 text-xs text-emerald-400 font-medium">{current.predictiveImpact}</div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Portfolio Data Coverage:</span>
                      <span className="font-mono font-semibold text-white">{current.coverage}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Supported Ingestion Feeds:</span>
                      <span className="text-slate-300 text-right">{current.dataSources}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <Link
                    to="/app/risk-assessment"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all"
                  >
                    <span>Test With Custom Borrower Input</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
