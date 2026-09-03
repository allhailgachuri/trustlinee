import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { authApi } from "@/api/auth";
import type { User } from "@/lib/types";
import {
  Bell,
  Building,
  Check,
  Cpu,
  Key,
  Lock,
  Save,
  Shield,
  Sliders,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "org" | "thresholds" | "notifications" | "security" | "model">("thresholds");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Risk Thresholds state
  const [lowCutoff, setLowCutoff] = useState(5.0);
  const [medCutoff, setMedCutoff] = useState(12.0);
  const [highCutoff, setHighCutoff] = useState(25.0);

  useEffect(() => {
    authApi.getCurrentUser().then(setCurrentUser);
  }, []);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Risk policy thresholds updated for sandbox environment.");
  };

  const tabs = [
    { id: "thresholds", label: "Risk Thresholds", icon: Sliders },
    { id: "profile", label: "User Profile", icon: UserIcon },
    { id: "org", label: "Organization", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & API Keys", icon: Key },
    { id: "model", label: "Model Config", icon: Cpu },
  ];

  return (
    <AppLayout
      title="Platform Settings"
      subtitle="Configure risk appetite boundaries, decision thresholds, user profile, and security keys."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Navigation Tabs */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all text-left ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9">
          {activeTab === "thresholds" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Credit Risk Band Cutoffs</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust Probability of Default (PD) boundary thresholds for automated underwriting segmentation.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
                <span className="font-bold">Evaluation Sandbox Notice: </span>
                Threshold modifications are simulated locally. Production risk bands require committee validation and empirical loss calibration.
              </div>

              <form onSubmit={handleSaveThresholds} className="space-y-6 text-xs">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-emerald-400">Low Risk Cutoff (PD &le;)</div>
                      <span className="font-mono text-sm font-bold text-white">{lowCutoff}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={lowCutoff}
                      onChange={(e) => setLowCutoff(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Borrowers with PD &le; {lowCutoff}% receive automated standard review recommendations.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-amber-400">Medium Risk Cutoff (PD &le;)</div>
                      <span className="font-mono text-sm font-bold text-white">{medCutoff}%</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="20"
                      step="0.5"
                      value={medCutoff}
                      onChange={(e) => setMedCutoff(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Borrowers between {lowCutoff}% and {medCutoff}% require basic secondary verification.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="font-semibold text-rose-400">High Risk Upper Limit (PD &le;)</div>
                      <span className="font-mono text-sm font-bold text-white">{highCutoff}%</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="40"
                      step="1"
                      value={highCutoff}
                      onChange={(e) => setHighCutoff(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <p className="text-[10px] text-slate-500">
                      Borrowers with PD &gt; {highCutoff}% are automatically routed into the Severe risk tier.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Policy Settings</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white">Underwriter Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400">Full Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser?.name}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">Institutional Email</label>
                  <input
                    type="email"
                    defaultValue={currentUser?.email}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400">Current Assigned Role</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.role?.toUpperCase()}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 text-xs text-blue-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white">Inference API Authentication & Keys</h2>
              <p className="text-xs text-slate-400">
                Connect external digital banking core or loan origination system (LOS) via REST endpoint.
              </p>

              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>FastAPI Production Base URL</span>
                  <span className="text-emerald-400 font-mono">https://api.trustline.io/v1</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                  <span>Sandbox Authorization Token</span>
                  <span className="font-mono text-slate-300">sk_demo_live_77291a0c83</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "org" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white">Institution Profile</h2>
              <div className="text-xs text-slate-300 space-y-3">
                <div>Organization: <strong>Trustline Evaluation Sandbox</strong></div>
                <div>Jurisdiction: <strong>Kenya / East Africa (CBK Compliant Architecture)</strong></div>
                <div>Lending Portfolio: <strong>Active MSME & Alternative Credit</strong></div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Notification Alert Preferences</h2>
              <p className="text-xs text-slate-400">Configure automated alerts for delinquency surges and model drift.</p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800" />
                  <span>Alert on Severe Risk queue volume exceeding 5 applications</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800" />
                  <span>Notify when feature PSI drift enters 'watch' status</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "model" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Model Engine Runtime</h2>
              <div className="text-xs text-slate-300 space-y-2">
                <div>Primary Scoring Model: <strong>XGBoost Scorecard v1.4.0 (Active)</strong></div>
                <div>Baseline Benchmark: <strong>Logistic Regression Scorecard v0.9.1</strong></div>
                <div>SHAP Kernel: <strong>TreeExplainer GPU / C-Accelerated</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
