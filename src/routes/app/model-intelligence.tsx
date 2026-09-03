import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { modelApi } from "@/api/model";
import type { ModelIntelligence } from "@/lib/types";
import { pct, shortDate } from "@/lib/format";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  Info,
  Layers,
  Scale,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/app/model-intelligence")({
  component: ModelIntelligencePage,
});

function ModelIntelligencePage() {
  const [data, setData] = useState<ModelIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    modelApi
      .getModelIntelligence()
      .then((res) => {
        setData(res);
        if (res.featureImportance[0]) {
          setSelectedFeature(res.featureImportance[0].feature);
        }
      })
      .catch((err) => setError(err.message || "Failed to load model intelligence"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="Model Intelligence & Governance"
      subtitle="Comprehensive statistical validation, model benchmark comparisons, and live feature drift monitoring."
    >
      {loading && <LoadingState message="Loading model validation scorecards and telemetry..." />}
      {error && <ErrorState description={error} />}

      {!loading && data && (
        <div className="space-y-8">
          {/* Active Model Header Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    Production Active Model
                  </span>
                  <span className="font-mono text-xs text-slate-400">{data.currentModel.version}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{data.currentModel.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span>Dataset: <strong className="text-slate-200">{data.currentModel.datasetVersion}</strong></span>
                  <span>•</span>
                  <span>Observations: <strong className="font-mono text-white">{data.currentModel.observations.toLocaleString()}</strong></span>
                  <span>•</span>
                  <span>Last Trained: <strong className="text-slate-200">{shortDate(data.currentModel.trainedAt)}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-center">
                  <div className="text-[11px] font-semibold text-slate-400">Model AUC</div>
                  <div className="font-mono text-2xl font-bold text-emerald-400">0.884</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-center">
                  <div className="text-[11px] font-semibold text-slate-400">KS Statistic</div>
                  <div className="font-mono text-2xl font-bold text-blue-400">54.2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Comparison Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Benchmark Comparison: XGBoost vs Logistic Baseline</h3>
              <p className="text-xs text-slate-400">Statistical evaluation on out-of-time validation dataset</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Model Architecture</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">AUC-ROC</th>
                    <th className="py-2.5 px-3">KS Stat</th>
                    <th className="py-2.5 px-3">Precision</th>
                    <th className="py-2.5 px-3">Recall</th>
                    <th className="py-2.5 px-3">F1 Score</th>
                    <th className="py-2.5 px-3">Brier / Calib</th>
                    <th className="py-2.5 px-3">Interpretability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.comparison.map((m) => (
                    <tr key={m.name} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            m.tag === "primary"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {m.tag}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">{m.auc.toFixed(3)}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{m.ks.toFixed(1)}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{pct(m.precision, 1)}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{pct(m.recall, 1)}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{m.f1.toFixed(3)}</td>
                      <td className="py-3 px-3 font-mono text-slate-200">{m.calibration.toFixed(3)}</td>
                      <td className="py-3 px-3 capitalize text-slate-300">{m.interpretability} (SHAP)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistical Curves: ROC & Precision-Recall */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROC Curve */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">ROC Curve (Receiver Operating Characteristic)</h3>
                  <p className="text-xs text-slate-400">True Positive Rate vs False Positive Rate</p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400">AUC = 0.884</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.roc} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="fpr" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                    <Line type="monotone" dataKey="tpr" name="XGBoost Primary (0.884)" stroke="#10b981" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="baseline" name="Scorecard Baseline (0.768)" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calibration Reliability Diagram */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Calibration Reliability Plot</h3>
                  <p className="text-xs text-slate-400">Predicted Probability vs Observed Default Frequency</p>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400">Calibrated</span>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.calibration} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="predicted" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#090d16", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(v: any) => [`${v}%`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "5px" }} />
                    <Line type="monotone" dataKey="observed" name="Observed Default %" stroke="#3b82f6" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="predicted" name="Ideal 45° Calibration" stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Global Feature Importance & PSI Feature Drift */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Global Feature Importance */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Global Feature Importance (SHAP Mean |Value|)</h3>
                <p className="text-xs text-slate-400">Click a feature below to view mathematical interpretation</p>
              </div>

              <div className="space-y-2.5">
                {data.featureImportance.map((f) => {
                  const active = selectedFeature === f.feature;
                  return (
                    <div
                      key={f.feature}
                      onClick={() => setSelectedFeature(f.feature)}
                      className={`cursor-pointer rounded-xl p-3 border transition-all ${
                        active
                          ? "bg-blue-600/15 border-blue-500/40"
                          : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{f.label}</span>
                        <span className="font-mono font-bold text-blue-400">{pct(f.importance, 0)}</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${f.importance * 100 * 3.2}%` }}
                        />
                      </div>
                      {active && (
                        <p className="mt-2 text-[11px] text-slate-300 border-t border-slate-800/80 pt-2">
                          {f.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PSI Drift Monitoring */}
            <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Covariate Drift Monitoring (PSI)</h3>
                <p className="text-xs text-slate-400">Population Stability Index tracking feature shifts</p>
              </div>

              <div className="space-y-3">
                {data.monitoring.driftIndicator.map((d) => (
                  <div key={d.feature} className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs">
                    <div>
                      <div className="font-medium text-white">{d.feature}</div>
                      <div className="text-[10px] font-mono text-slate-400">PSI: {d.psi.toFixed(3)}</div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                        d.status === "stable"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-950/80 p-3.5 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">PSI Governance Rule:</div>
                <p>PSI &lt; 0.10: Stable • 0.10–0.25: Moderate Shift • &gt; 0.25: Model Retrain Required</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
