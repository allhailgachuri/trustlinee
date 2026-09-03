import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/shared/KpiCard";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { portfolioApi } from "@/api/portfolio";
import type { PortfolioData } from "@/lib/types";
import { KES, pct } from "@/lib/format";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Download, Layers, PieChart as PieIcon, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    portfolioApi
      .getPortfolioData()
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load portfolio metrics"))
      .finally(() => setLoading(false));
  }, []);

  const BAND_COLORS: Record<string, string> = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    severe: "#ef4444",
  };

  const handleExport = () => {
    toast.success("Exporting portfolio analytics report...");
  };

  return (
    <AppLayout
      title="Portfolio Risk & Exposure"
      subtitle="Comprehensive lender oversight across credit book concentration, loss vintages, and capital distribution."
      actions={
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Analytics</span>
        </button>
      }
    >
      {loading && <LoadingState message="Aggregating portfolio risk metrics..." />}
      {error && <ErrorState description={error} />}

      {!loading && data && (
        <div className="space-y-6">
          {/* Portfolio KPI Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.key} metric={kpi} />
            ))}
          </div>

          {/* Risk Band: Count vs Monetary Exposure Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Risk Distribution by Borrower Count</h3>
                <p className="text-xs text-slate-400">Headcount percentage across risk categories</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distribution}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {data.distribution.map((entry) => (
                        <Cell key={entry.band} fill={BAND_COLORS[entry.band]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Risk Distribution by Monetary Capital Exposure</h3>
                <p className="text-xs text-slate-400">Actual KES outstanding principal committed per band</p>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distribution}
                      dataKey="exposure"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {data.distribution.map((entry) => (
                        <Cell key={entry.band} fill={BAND_COLORS[entry.band]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [KES(Number(v), true), "Exposure"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Exposure Migration & Default by Purpose */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Capital Exposure Growth by Tier */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Exposure Trends by Risk Band (Millions KES)</h3>
                <p className="text-xs text-slate-400">Portfolio expansion and risk tier stabilization</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.exposureTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [`KES ${v}M`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                    <Area type="monotone" dataKey="low" name="Low Risk" fill="#10b981" stroke="#10b981" stackId="1" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="medium" name="Medium Risk" fill="#f59e0b" stroke="#f59e0b" stackId="1" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="high" name="High Risk" fill="#f97316" stroke="#f97316" stackId="1" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="severe" name="Severe Risk" fill="#ef4444" stroke="#ef4444" stackId="1" fillOpacity={0.7} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Default Rates by Purpose */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Default Rate by Loan Purpose</h3>
                <p className="text-xs text-slate-400">Observed default percentage across borrowing intents</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.defaultByPurpose} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <YAxis dataKey="purpose" type="category" stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [pct(Number(v), 1), "Default Rate"]}
                    />
                    <Bar dataKey="defaultRate" name="Default %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
