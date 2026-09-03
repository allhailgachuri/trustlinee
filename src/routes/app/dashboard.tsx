import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/shared/KpiCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { dashboardApi } from "@/api/dashboard";
import type { DashboardData } from "@/lib/types";
import { KES, pct, shortDate } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { ArrowRight, Calendar, Download, Filter, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("30d");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardApi.getDashboardData(timeRange);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const RISK_COLORS = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    severe: "#ef4444",
  };

  return (
    <AppLayout
      title="Credit Risk Overview"
      subtitle="Real-time monitoring of loan applications, borrower risk, and portfolio exposure."
      actions={
        <div className="flex items-center gap-2">
          {/* Time Filter Buttons */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs">
            {(["24h", "7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  timeRange === r
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <Link
            to="/app/risk-assessment"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Score Applicant</span>
          </Link>
        </div>
      }
    >
      {loading && <LoadingState message="Calculating real-time portfolio metrics..." />}
      {error && <ErrorState description={error} onRetry={loadData} />}

      {!loading && data && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.key} metric={kpi} />
            ))}
          </div>

          {/* Primary Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Default Rate Over Time */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Default Rate Trends (90+ DPD)</h3>
                  <p className="text-xs text-slate-400">
                    Observed defaults vs baseline benchmark model over trailing 6 months
                  </p>
                </div>
                <span className="font-mono text-xs text-emerald-400 font-semibold">-1.4pp Improvement</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.defaultRateOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [`${v}%`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="observed" name="Observed Default %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="predicted" name="Model Predicted %" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="baseline" name="Scorecard Baseline" stroke="#64748b" strokeWidth={1.5} strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Band Distribution Donut */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-4 space-y-4">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-bold text-white">Risk Band Exposure</h3>
                <p className="text-xs text-slate-400">Capital deployed across risk tiers</p>
              </div>
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.riskBandDistribution}
                      dataKey="exposure"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {data.riskBandDistribution.map((entry) => (
                        <Cell key={entry.band} fill={RISK_COLORS[entry.band]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [KES(Number(v), true), "Exposure"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {data.riskBandDistribution.map((b) => (
                  <div key={b.band} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: RISK_COLORS[b.band] }} />
                    <span className="text-slate-300 text-[11px] truncate">{b.label} ({b.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary Charts: Volume & Probability Histogram */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Application Volume Trends */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Application Throughput</h3>
                  <p className="text-xs text-slate-400">Underwriting volume per week</p>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.applicationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                    <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="referred" name="Referred" fill="#3b82f6" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Probability of Default Distribution Histogram */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Probability of Default (PD) Distribution</h3>
                  <p className="text-xs text-slate-400">Borrower density across calibrated risk buckets</p>
                </div>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.pdDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Bar dataKey="count" name="Borrower Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Priority High-Risk & Pending Queue Table */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Priority Underwriting Queue</h3>
              </div>
              <Link
                to="/app/applications"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <span>View all {applicationsOverTimeTotal(data.applicationsOverTime)} applications</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3">Borrower</th>
                    <th className="py-2.5 px-3">Loan Amount</th>
                    <th className="py-2.5 px-3">Score / PD</th>
                    <th className="py-2.5 px-3">Risk Band</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.highRiskApplications.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => navigate({ to: `/app/applications/${app.id}` })}
                      className="cursor-pointer transition-colors hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-3 font-mono font-medium text-white">{app.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-200">{app.borrowerName}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{KES(app.amount)}</td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-white">{app.riskScore}</span>{" "}
                        <span className="text-slate-400">({pct(app.probabilityOfDefault, 1)})</span>
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge band={app.riskBand} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <DecisionBadge decision={app.decision} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-slate-400">{shortDate(app.createdAt)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-blue-400 font-semibold hover:underline">
                          Review <ArrowRight className="h-3 w-3" />
                        </span>
                      </td>
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

function applicationsOverTimeTotal(points: any[]) {
  return points.reduce((acc, p) => acc + (p.received || 0), 0);
}
