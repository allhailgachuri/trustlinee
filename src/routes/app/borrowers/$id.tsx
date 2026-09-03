import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { ContributionBars } from "@/components/shared/ContributionBars";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { borrowersApi, type BorrowerDetailResponse } from "@/api/borrowers";
import { KES, pct, shortDate, SEGMENT_LABEL, EMPLOYMENT_LABEL, RESIDENCE_LABEL, PURPOSE_LABEL } from "@/lib/format";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileSpreadsheet,
  History,
  Layers,
  MapPin,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/app/borrowers/$id")({
  component: BorrowerDetailPage,
});

function BorrowerDetailPage() {
  const { id } = useParams({ from: "/app/borrowers/$id" });
  const [data, setData] = useState<BorrowerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    borrowersApi
      .getBorrowerById(id)
      .then((res) => {
        if (!res) throw new Error(`Borrower ${id} not found.`);
        setData(res);
      })
      .catch((err) => setError(err.message || "Failed to load borrower"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppLayout
      title={data ? `${data.borrower.name} — 360° Credit Profile` : "Borrower Detail"}
      subtitle="Complete credit history, mobile-money cashflows, delinquency audit, and alternative signals."
      actions={
        <Link
          to="/app/borrowers"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Directory</span>
        </Link>
      }
    >
      {loading && <LoadingState message={`Loading credit dossier for ${id}...`} />}
      {error && <ErrorState description={error} />}

      {!loading && data && (
        <div className="space-y-6">
          {/* Header Dossier Profile Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xl shadow-lg">
                  {data.borrower.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{data.borrower.name}</h2>
                    <RiskBadge band={data.borrower.riskBand} size="sm" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="font-mono text-blue-400">{data.borrower.id}</span>
                    <span>•</span>
                    <span>{SEGMENT_LABEL[data.borrower.segment]}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {data.borrower.county}, Kenya
                    </span>
                    <span>•</span>
                    <span>Member since {shortDate(data.borrower.joinedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 text-xs">
                <div>
                  <span className="text-slate-400">Credit Score</span>
                  <div className="font-mono text-xl font-extrabold text-white mt-0.5">{data.borrower.riskScore}</div>
                  <div className="text-[10px] text-slate-500">PD: {pct(data.borrower.probabilityOfDefault, 1)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Income</span>
                  <div className="font-mono text-xl font-bold text-slate-200 mt-0.5">
                    {KES(data.borrower.monthlyIncome, true)}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">Verified Inflow</div>
                </div>
                <div>
                  <span className="text-slate-400">Active Facilities</span>
                  <div className="font-mono text-xl font-bold text-slate-200 mt-0.5">
                    {data.loans.filter((l) => l.status === "active").length}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Bal: {KES(data.borrower.outstandingBalance || 0, true)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Repayment Rate</span>
                  <div className="font-mono text-xl font-bold text-emerald-400 mt-0.5">
                    {pct(data.borrower.repayment.repaymentConsistency, 0)}
                  </div>
                  <div className="text-[10px] text-slate-500">Max DPD: {data.borrower.repayment.daysPastDueMax}d</div>
                </div>
              </div>
            </div>
          </div>

          {/* 12-Month Mobile Cash Flow & Inflow Volatility */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">12-Month Mobile Inflow vs Outflow Cashflow Profile</h3>
                <p className="text-xs text-slate-400">
                  Verifiable mobile wallet monthly receipts and expenditure commitments
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400 font-semibold">
                  Avg Inflow: {KES(data.borrower.transactions.averageMonthlyInflow, true)}
                </span>
                <span className="text-slate-400">
                  Avg Outflow: {KES(data.borrower.transactions.averageMonthlyOutflow, true)}
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.borrower.transactions.monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: any) => [KES(Number(v)), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                  <Bar dataKey="inflow" name="Monthly Inflow (KES)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" name="Monthly Outflow (KES)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Repayment Timeline & SHAP Attribution Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Repayment Event Timeline */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Repayment Event Timeline</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {data.repayments.length} Recorded Events
                </span>
              </div>

              <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                {data.repayments.map((evt, idx) => (
                  <div key={evt.id} className="relative flex gap-3.5 text-xs">
                    {/* Timeline Line */}
                    {idx < data.repayments.length - 1 && (
                      <div className="absolute top-5 left-2.5 -bottom-5 w-0.5 bg-slate-800" />
                    )}

                    <div
                      className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                        evt.type === "paid" || evt.type === "completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : evt.type === "late"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : evt.type === "missed"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      }`}
                    >
                      {evt.type === "paid" ? "✓" : evt.type === "missed" ? "✕" : "•"}
                    </div>

                    <div className="flex-1 rounded-xl bg-slate-950/80 p-3 border border-slate-800/80">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-white capitalize">{evt.type}</span>
                        <span className="font-mono text-slate-400">{shortDate(evt.date)}</span>
                      </div>
                      <p className="mt-1 text-slate-300">{evt.note}</p>
                      {evt.amount > 0 && (
                        <div className="mt-1.5 font-mono text-[11px] text-slate-400">
                          Amount: <strong className="text-white">{KES(evt.amount)}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Scorecard & SHAP Breakdown */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Latest Assessment SHAP Attribution</h3>
                </div>
              </div>

              {data.latestAssessment?.contributions ? (
                <ContributionBars contributions={data.latestAssessment.contributions} maxBars={5} />
              ) : (
                <div className="text-xs text-slate-500 py-8 text-center">
                  SHAP feature contributions available on assessment calculation.
                </div>
              )}
            </div>
          </div>

          {/* Historical Loans Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Credit Facility History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Facility ID</th>
                    <th className="py-2.5 px-3">Purpose</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Tenure</th>
                    <th className="py-2.5 px-3">Outstanding</th>
                    <th className="py-2.5 px-3">Interest Rate</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Disbursed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.loans.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-medium text-white">{l.id}</td>
                      <td className="py-3 px-3 text-slate-300">{PURPOSE_LABEL[l.purpose]}</td>
                      <td className="py-3 px-3 font-mono text-white font-medium">{KES(l.amount)}</td>
                      <td className="py-3 px-3 text-slate-400">{l.tenureMonths} Months</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{KES(l.outstanding)}</td>
                      <td className="py-3 px-3 font-mono text-slate-400">{pct(l.interestRate, 1)} p.a.</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            l.status === "active"
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : l.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{shortDate(l.issuedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
