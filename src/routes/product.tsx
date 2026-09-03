import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  FileCheck,
  FileSpreadsheet,
  Layers,
  Lock,
  PieChart,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/product")({
  component: ProductPage,
});

function ProductPage() {
  const modules = [
    {
      title: "Real-Time Underwriting Engine",
      badge: "Decision Support",
      description:
        "Transforms borrower financial and alternative data into real-time credit risk scores, probability of default (PD) estimations, and semantic risk bands.",
      features: [
        "Sub-second scoring latency with transparent logistic & gradient-boosted models",
        "Configurable decision thresholds (Approve, Refer for Review, Reject)",
        "Automated adverse signal detection (delinquency spike, cashflow drain)",
        "Direct integration with FastAPI inference endpoints",
      ],
      icon: Sparkles,
      link: "/app/risk-assessment",
    },
    {
      title: "SHAP Explainability & Attribution",
      badge: "Model Governance",
      description:
        "Every risk score is deconstructed into signed feature contributions, showing underwriters precisely why an applicant was assigned a specific risk band.",
      features: [
        "Feature contribution waterfalls with directional impact (+/- risk)",
        "Contextual natural-language rationale for credit analysts and auditors",
        "Individual borrower explanations alongside global feature rankings",
        "Adherence to responsible AI and non-discriminatory lending standards",
      ],
      icon: Cpu,
      link: "/explainability",
    },
    {
      title: "Portfolio Risk & Exposure Analytics",
      badge: "Lender Intelligence",
      description:
        "Executive oversight into total credit exposure, risk migration, default velocities, and capital concentration across borrower segments.",
      features: [
        "Dual-lens risk breakdown: Population count vs Monetary capital exposure",
        "Cohort vintage analysis across quarters, loan purposes, and borrower segments",
        "Time-series monitoring of 30/60/90+ DPD default curves",
        "Interactive multidimensional scatter plots for behaviour correlation",
      ],
      icon: PieChart,
      link: "/app/portfolio",
    },
    {
      title: "Institutional Reporting Suite",
      badge: "Compliance & Audit",
      description:
        "Automated generation of comprehensive credit risk, cohort performance, and model validation reports for credit committees and leadership.",
      features: [
        "Executive summaries with key findings and strategic risk recommendations",
        "High-risk watchlist tracking with borrower-level delinquency metrics",
        "Ready for backend PDF rendering and export",
        "Immutable audit trails recording every underwriting decision and policy update",
      ],
      icon: FileSpreadsheet,
      link: "/app/reports",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Activity className="h-3.5 w-3.5" />
            <span>The Trustline Product Suite</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Institutional Credit Risk Intelligence
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            A comprehensive suite of underwriting tools, explainable machine learning scorecards, portfolio analytics, and governance systems built for digital lenders.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all active:scale-95"
            >
              <span>Launch Live Platform</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Modules */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            const isEven = idx % 2 === 0;
            return (
              <div
                key={m.title}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-12"
              >
                <div className={`lg:col-span-7 space-y-5 ${isEven ? "order-1" : "order-1 lg:order-2"}`}>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                      {m.badge}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{m.title}</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">{m.description}</p>

                  <div className="space-y-2.5 pt-2">
                    {m.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      to={m.link}
                      className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300"
                    >
                      <span>Explore this module in sandbox</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className={`lg:col-span-5 ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
                  <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 text-blue-400 shadow-inner">
                    <div className="text-center space-y-3">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20">
                        <Icon className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="font-mono text-xs text-slate-400">{m.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
