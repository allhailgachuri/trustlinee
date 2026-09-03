import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { ContributionBars } from "@/components/shared/ContributionBars";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { riskApi } from "@/api/risk";
import type { RiskAssessmentInput } from "@/lib/types";
import { type ScoredResult } from "@/lib/risk-engine";
import { KES, pct } from "@/lib/format";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Cpu,
  Info,
  Layers,
  RefreshCw,
  RotateCcw,
  Shield,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/risk-assessment")({
  component: RiskAssessmentPage,
});

const DEFAULT_INPUT: RiskAssessmentInput = {
  age: 32,
  monthlyIncome: 65_000,
  employmentStatus: "self_employed",
  dependants: 2,
  residenceType: "rented",
  loanAmount: 35_000,
  tenureMonths: 12,
  purpose: "business_working_capital",
  transactionFrequency: 36,
  averageMonthlyInflow: 78_000,
  transactionVolatility: 0.22,
  averageBalance: 18_500,
  utilisationRatio: 0.35,
  repaymentConsistency: 0.91,
  previousLoans: 3,
  daysPastDue: 0,
  previousDefaults: 0,
  accountTenureMonths: 28,
  activeAccounts: 2,
};

function RiskAssessmentPage() {
  const [input, setInput] = useState<RiskAssessmentInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<ScoredResult | null>(null);
  const [scoring, setScoring] = useState(false);

  // Auto score on initial load
  useState(() => {
    riskApi.assessRisk(DEFAULT_INPUT).then(setResult);
  });

  const handleScore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setScoring(true);
    try {
      const res = await riskApi.assessRisk(input);
      setResult(res);
      toast.success("Risk assessment calculated successfully");
    } finally {
      setScoring(false);
    }
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    riskApi.assessRisk(DEFAULT_INPUT).then(setResult);
    toast.info("Parameters reset to default scenario");
  };

  const handleQuickPreset = (preset: "low" | "medium" | "high" | "severe") => {
    const presets: Record<string, Partial<RiskAssessmentInput>> = {
      low: {
        monthlyIncome: 120_000,
        repaymentConsistency: 0.98,
        utilisationRatio: 0.15,
        transactionVolatility: 0.1,
        daysPastDue: 0,
        previousDefaults: 0,
        accountTenureMonths: 48,
        loanAmount: 40_000,
      },
      medium: {
        monthlyIncome: 65_000,
        repaymentConsistency: 0.82,
        utilisationRatio: 0.42,
        transactionVolatility: 0.28,
        daysPastDue: 8,
        previousDefaults: 0,
        accountTenureMonths: 24,
        loanAmount: 35_000,
      },
      high: {
        monthlyIncome: 42_000,
        repaymentConsistency: 0.62,
        utilisationRatio: 0.72,
        transactionVolatility: 0.52,
        daysPastDue: 28,
        previousDefaults: 1,
        accountTenureMonths: 12,
        loanAmount: 45_000,
      },
      severe: {
        monthlyIncome: 25_000,
        repaymentConsistency: 0.4,
        utilisationRatio: 0.92,
        transactionVolatility: 0.68,
        daysPastDue: 60,
        previousDefaults: 2,
        accountTenureMonths: 6,
        loanAmount: 50_000,
      },
    };

    const updated = { ...input, ...presets[preset] };
    setInput(updated);
    riskApi.assessRisk(updated).then(setResult);
    toast.info(`Loaded ${preset.toUpperCase()} risk test preset`);
  };

  return (
    <AppLayout
      title="Credit Risk Assessment"
      subtitle="Interactive underwriting simulator — evaluate applicant financial, behavioural, and alternative data signals."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      }
    >
      {/* Scenario Presets Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="flex items-center gap-2">
          {(["low", "medium", "high", "severe"] as const).map((band) => (
            <button
              key={band}
              onClick={() => handleQuickPreset(band)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-900 transition-colors capitalize"
            >
              {band === "severe" ? "Very High (Severe)" : `${band} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form on Left, Instant Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleScore} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-8 backdrop-blur-xl shadow-2xl">
            {/* Section 1: Borrower Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <User className="h-4 w-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  1. Borrower Demographics
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="75"
                    value={input.age}
                    onChange={(e) => setInput({ ...input, age: parseInt(e.target.value) || 18 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Monthly Verifiable Income (KES)</label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={input.monthlyIncome}
                    onChange={(e) => setInput({ ...input, monthlyIncome: parseInt(e.target.value) || 5000 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Employment Status</label>
                  <select
                    value={input.employmentStatus}
                    onChange={(e) => setInput({ ...input, employmentStatus: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="employed">Employed (Salaried)</option>
                    <option value="self_employed">Self-Employed (MSME)</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="casual">Casual Worker</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Residence Status</label>
                  <select
                    value={input.residenceType}
                    onChange={(e) => setInput({ ...input, residenceType: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="owned">Owned Home</option>
                    <option value="rented">Rented</option>
                    <option value="family">Family Property</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Loan Facility Request */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Calculator className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  2. Loan Facility Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Requested Principal (KES)</label>
                  <input
                    type="number"
                    min="5000"
                    step="1000"
                    value={input.loanAmount}
                    onChange={(e) => setInput({ ...input, loanAmount: parseInt(e.target.value) || 5000 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Tenure (Months)</label>
                  <select
                    value={input.tenureMonths}
                    onChange={(e) => setInput({ ...input, tenureMonths: parseInt(e.target.value) || 12 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="9">9 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Loan Purpose</label>
                  <select
                    value={input.purpose}
                    onChange={(e) => setInput({ ...input, purpose: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="business_working_capital">Business Working Capital</option>
                    <option value="school_fees">School Fees Advance</option>
                    <option value="agriculture_inputs">Agriculture Inputs</option>
                    <option value="asset_purchase">Productive Asset</option>
                    <option value="medical">Medical Expenses</option>
                    <option value="emergency">Emergency Liquidity</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Alternative Transaction & Cashflow Telemetry */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  3. Alternative Cashflow & Telemetry
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-slate-300 font-medium">Repayment Consistency</label>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round(input.repaymentConsistency * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.99"
                    step="0.01"
                    value={input.repaymentConsistency}
                    onChange={(e) => setInput({ ...input, repaymentConsistency: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500">Trailing on-time installment completion rate</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-slate-300 font-medium">Cash Flow Utilisation Ratio</label>
                    <span className="font-mono text-amber-400 font-bold">
                      {Math.round(input.utilisationRatio * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.98"
                    step="0.01"
                    value={input.utilisationRatio}
                    onChange={(e) => setInput({ ...input, utilisationRatio: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[10px] text-slate-500">Outflows committed against monthly inflow</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-slate-300 font-medium">Transaction Volatility</label>
                    <span className="font-mono text-blue-400 font-bold">
                      {input.transactionVolatility.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.01"
                    value={input.transactionVolatility}
                    onChange={(e) => setInput({ ...input, transactionVolatility: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">Weekly revenue fluctuation coefficient</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-slate-300 font-medium">Account Tenure</label>
                    <span className="font-mono text-white font-bold">{input.accountTenureMonths} Mos</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="84"
                    step="1"
                    value={input.accountTenureMonths}
                    onChange={(e) => setInput({ ...input, accountTenureMonths: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-[10px] text-slate-500">Duration of verified digital wallet history</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Historical Max Days Past Due (DPD)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={input.daysPastDue}
                    onChange={(e) => setInput({ ...input, daysPastDue: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Historical 90+ DPD Write-offs</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={input.previousDefaults}
                    onChange={(e) => setInput({ ...input, previousDefaults: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={scoring}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{scoring ? "Scoring Applicant..." : "Calculate Credit Risk Assessment"}</span>
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          {result && (
            <>
              {/* Score Card Result Container */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Risk Assessment Result
                  </span>
                  <RiskBadge band={result.riskBand} size="sm" />
                </div>

                <div className="py-2">
                  <ScoreGauge
                    score={result.riskScore}
                    probabilityOfDefault={result.probabilityOfDefault}
                    riskBand={result.riskBand}
                    size="lg"
                  />
                </div>

                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-300">Model Recommendation:</div>
                  <p className="text-slate-400 leading-relaxed font-medium">"{result.recommendation}"</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>Model: XGBoost v1.4.0</span>
                    <span className="font-mono text-blue-400">Confidence: {pct(result.confidence, 1)}</span>
                  </div>
                </div>
              </div>

              {/* Explainability Breakdown */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl">
                <ContributionBars contributions={result.contributions} maxBars={5} />
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
