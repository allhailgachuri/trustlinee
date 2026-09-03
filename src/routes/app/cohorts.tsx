import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { cohortsApi } from "@/api/cohorts";
import type { Cohort } from "@/lib/types";
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
} from "recharts";
import { Layers, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/cohorts")({
  component: CohortsPage,
});

function CohortsPage() {
  const [dimension, setDimension] = useState<"quarter" | "segment" | "purpose" | "band">("quarter");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    cohortsApi
      .getCohorts(dimension)
      .then(setCohorts)
      .catch((err) => setError(err.message || "Failed to load cohorts"))
      .finally(() => setLoading(false));
  }, [dimension]);

  return (
    <AppLayout
      title="Cohort Analysis & Loss Vintages"
      subtitle="Track performance, repayment compliance, and default velocity across origination cohorts."
      actions={
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-xs">
          {[
            { id: "quarter", label: "Quarters" },
            { id: "segment", label: "Segments" },
            { id: "purpose", label: "Purposes" },
            { id: "band", label: "Risk Bands" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDimension(d.id as any)}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                dimension === d.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      }
    >
      {loading && <LoadingState message="Calculating vintage cohort curves..." />}
      {error && <ErrorState description={error} />}

      {!loading && cohorts.length > 0 && (
        <div className="space-y-6">
          {/* Comparative Chart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Cohort Default Rate vs On-Time Repayment Rate
                </h3>
                <p className="text-xs text-slate-400">
                  Comparing {dimension.toUpperCase()} cohorts on key credit outcomes
                </p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cohorts} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: any) => [pct(Number(v), 1), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                  <Bar dataKey="defaultRate" name="Observed Default %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="repaymentRate" name="Repayment Compliance %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approvalRate" name="Approval Rate %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Cohort Matrix Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Cohort Performance Comparison Matrix</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Cohort Classification</th>
                    <th className="py-2.5 px-3">Borrower Volume</th>
                    <th className="py-2.5 px-3">Avg Loan Size</th>
                    <th className="py-2.5 px-3">Portfolio Mean PD</th>
                    <th className="py-2.5 px-3">Repayment Rate</th>
                    <th className="py-2.5 px-3">Default Rate</th>
                    <th className="py-2.5 px-3">Approval Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {cohorts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-white">{c.label}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{c.borrowers}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{KES(c.averageLoanSize)}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{pct(c.averagePd, 1)}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                        {pct(c.repaymentRate, 1)}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-rose-400">
                        {pct(c.defaultRate, 1)}
                      </td>
                      <td className="py-3 px-3 font-mono text-blue-400">{pct(c.approvalRate, 1)}</td>
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
