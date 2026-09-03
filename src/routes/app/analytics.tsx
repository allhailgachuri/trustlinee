import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { analyticsApi } from "@/api/analytics";
import type { AnalyticsData } from "@/lib/types";
import { pct } from "@/lib/format";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
} from "recharts";
import { BarChart3, Database, Layers, Sparkles, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    analyticsApi
      .getAnalyticsData()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="Credit Risk Analytics"
      subtitle="Deep econometric diagnostics, non-linear behavioural curves, and alternative data feature performance."
    >
      {loading && <LoadingState message="Computing non-linear econometric risk models..." />}
      {error && <ErrorState description={error} />}

      {!loading && data && (
        <div className="space-y-8">
          {/* Primary Curves: Default vs Utilisation & Volatility */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Rate vs Utilisation Ratio */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Default Rate by Cashflow Utilisation</h3>
                <p className="text-xs text-slate-400">Exponential loss acceleration when utilization crosses 60%</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.defaultByUtilisation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [pct(Number(v), 1), "Observed Default Rate"]}
                    />
                    <Bar dataKey="defaultRate" name="Default Rate" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Default Rate vs Repayment Consistency */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Default Rate by Repayment Consistency</h3>
                <p className="text-xs text-slate-400">High historical on-time rates compress default risk to near zero</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.defaultByRepaymentConsistency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [pct(Number(v), 1), "Observed Default Rate"]}
                    />
                    <Bar dataKey="defaultRate" name="Default Rate" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Secondary Curves: Volatility & Tenure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Default Rate vs Transaction Volatility */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Default Rate by Transaction Volatility</h3>
                <p className="text-xs text-slate-400">High weekly variance correlates with cash flow vulnerability</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.defaultByVolatility} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [pct(Number(v), 1), "Observed Default Rate"]}
                    />
                    <Bar dataKey="defaultRate" name="Default Rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Default Rate vs Account Tenure */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Default Rate by Mobile Account Tenure</h3>
                <p className="text-xs text-slate-400">Established mobile wallet history dramatically improves creditworthiness</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.defaultByTenure} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [pct(Number(v), 1), "Observed Default Rate"]}
                    />
                    <Bar dataKey="defaultRate" name="Default Rate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Alternative Data Telemetry Coverage & Freshness Matrix */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database className="h-4 w-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Alternative Data Ingestion Telemetry & Signal Quality</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Alternative Feature Signal</th>
                    <th className="py-2.5 px-3">Portfolio Coverage</th>
                    <th className="py-2.5 px-3">Sync Freshness</th>
                    <th className="py-2.5 px-3">Signal Reliability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.altDataCoverage.map((row) => (
                    <tr key={row.feature} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-white">{row.feature}</td>
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${row.coverage * 100}%` }}
                            />
                          </div>
                          <span>{pct(row.coverage, 0)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400">{row.freshness}</td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                          Verified Tier-1
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
