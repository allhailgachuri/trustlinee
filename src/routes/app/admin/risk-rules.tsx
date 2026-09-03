import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Save,
  Shield,
  Sliders,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin/risk-rules")({
  component: AdminRiskRulesPage,
});

function AdminRiskRulesPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [autoApproveCutoff, setAutoApproveCutoff] = useState(3.5);
  const [autoRejectCutoff, setAutoRejectCutoff] = useState(30.0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(250_000);

  const handleSave = () => {
    setConfirmOpen(false);
    toast.success("Underwriting rules successfully updated in demo sandbox.");
  };

  return (
    <AppLayout
      title="Risk Policies & Underwriting Rules"
      subtitle="Automated decisioning thresholds, model parameter bounds, and lending policy safeguards."
      actions={
        <Link
          to="/app/admin"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Admin Hub</span>
        </Link>
      }
    >
      <div className="max-w-4xl space-y-6">
        {/* Core Rules Configuration */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Automated Underwriting Decision Matrix</h2>
              <p className="text-xs text-slate-400">
                Define the model-assisted rules that suggest automated or referred pathways.
              </p>
            </div>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              Policy v2.4
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-400">
                  Fast-Track Approval Eligibility (PD &le;)
                </span>
                <span className="font-mono font-bold text-white">{autoApproveCutoff}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={autoApproveCutoff}
                onChange={(e) => setAutoApproveCutoff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[10px] text-slate-500">
                Borrowers with PD &le; {autoApproveCutoff}% with zero previous DPD are flagged for immediate low-friction approval.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-rose-400">
                  Automated Rejection Boundary (PD &gt;)
                </span>
                <span className="font-mono font-bold text-white">{autoRejectCutoff}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                step="1"
                value={autoRejectCutoff}
                onChange={(e) => setAutoRejectCutoff(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <p className="text-[10px] text-slate-500">
                Applicants with PD exceeding {autoRejectCutoff}% receive an automated decline recommendation with adverse notices.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-white">Maximum Single Facility Exposure Limit (KES)</span>
                <span className="font-mono font-bold text-blue-400">KES {maxLoanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="500000"
                step="25000"
                value={maxLoanAmount}
                onChange={(e) => setMaxLoanAmount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-[10px] text-slate-500">
                Facilities exceeding this amount require dual-signoff by two senior credit committee members.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Apply Policy Adjustments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">
              Confirm Risk Policy Modification
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-slate-400 space-y-2">
            <p>
              Are you sure you want to adjust the automated underwriting boundaries? This change will immediately alter the decision recommendations for incoming credit applicants.
            </p>
            <div className="rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-blue-400 border border-slate-800">
              Auto-Approve: &le; {autoApproveCutoff}% • Auto-Decline: &gt; {autoRejectCutoff}% • Max Limit: KES {maxLoanAmount.toLocaleString()}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
            >
              Confirm Policy Update
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
