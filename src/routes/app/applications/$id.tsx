import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { ContributionBars } from "@/components/shared/ContributionBars";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { applicationsApi, type ApplicationDetailResponse } from "@/api/applications";
import type { Decision } from "@/lib/types";
import { KES, pct, shortDate, PURPOSE_LABEL, SEGMENT_LABEL, EMPLOYMENT_LABEL, RESIDENCE_LABEL } from "@/lib/format";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  HelpCircle,
  History,
  Shield,
  ShieldAlert,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/app/applications/$id")({
  component: ApplicationDetailPage,
});

function ApplicationDetailPage() {
  const { id } = useParams({ from: "/app/applications/$id" });
  const [data, setData] = useState<ApplicationDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decision Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationsApi.getApplicationById(id);
      if (!res) throw new Error(`Application ${id} not found in credit registry.`);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Failed to load application detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleOpenDecisionModal = (decision: Decision) => {
    setPendingDecision(decision);
    setReviewNotes(
      decision === "approved"
        ? "Application meets verified cash flow and risk thresholds. Approved for disbursement."
        : decision === "rejected"
          ? "Excessive cash flow volatility and high DPD history exceed risk parameters."
          : "Referred for enhanced credit committee verification.",
    );
    setModalOpen(true);
  };

  const handleConfirmDecision = async () => {
    if (!pendingDecision) return;
    setActionLoading(true);
    try {
      await applicationsApi.updateDecision(id, pendingDecision, reviewNotes);
      toast.success(`Application ${id} updated to ${pendingDecision.toUpperCase()}`);
      setModalOpen(false);
      await fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to update decision");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AppLayout
      title={`Application Underwriting: ${id}`}
      subtitle="Detailed borrower evaluation, alternative data telemetry, and SHAP decision support."
      actions={
        <Link
          to="/app/applications"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Applications</span>
        </Link>
      }
    >
      {loading && <LoadingState message={`Retrieving underwriting dossier for ${id}...`} />}
      {error && <ErrorState description={error} onRetry={fetchDetail} />}

      {!loading && data && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold text-white">{data.application.id}</span>
                <RiskBadge band={data.application.riskBand} size="md" />
                <DecisionBadge decision={data.application.decision} size="md" />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>
                  Borrower:{" "}
                  <Link
                    to={`/app/borrowers/${data.borrower.id}`}
                    className="font-semibold text-blue-400 hover:underline"
                  >
                    {data.borrower.name} ({data.borrower.id})
                  </Link>
                </span>
                <span>•</span>
                <span>Facility: <strong className="text-white font-mono">{KES(data.application.amount)}</strong></span>
                <span>•</span>
                <span>Tenure: <strong className="text-white">{data.application.tenureMonths} Months</strong></span>
                <span>•</span>
                <span>Purpose: <strong className="text-white">{PURPOSE_LABEL[data.application.purpose]}</strong></span>
              </div>
            </div>

            {/* Action Buttons for Underwriter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleOpenDecisionModal("approved")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Facility</span>
              </button>

              <button
                onClick={() => handleOpenDecisionModal("referred")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Refer for Review</span>
              </button>

              <button
                onClick={() => handleOpenDecisionModal("rejected")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all active:scale-95"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>

          {/* Underwriter Notes Banner if reviewed */}
          {data.application.reviewedBy && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <FileCheck className="h-4 w-4 text-blue-400" />
                <span>
                  Last Reviewed by <strong className="text-white">{data.application.reviewedBy}</strong> on {shortDate(data.application.createdAt)}
                </span>
              </div>
              {data.application.notes && (
                <p className="text-slate-300 pl-6 italic">"{data.application.notes}"</p>
              )}
            </div>
          )}

          {/* Core Scoring & SHAP Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scorecard Gauge & Recommendation */}
            <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Credit Risk Scorecard</h3>
                <p className="text-xs text-slate-400">Model-estimated Probability of Default</p>
              </div>

              <div className="py-4">
                <ScoreGauge
                  score={data.application.riskScore}
                  probabilityOfDefault={data.application.probabilityOfDefault}
                  riskBand={data.application.riskBand}
                  size="lg"
                />
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs space-y-2">
                <div className="font-semibold text-slate-300">Decision Support Recommendation:</div>
                <p className="text-slate-400 leading-relaxed">
                  {data.latestAssessment?.recommendation || "Suitable for standard underwriter review."}
                </p>
                <div className="text-[10px] text-blue-400 pt-1 font-mono">
                  Model Confidence: {pct(data.latestAssessment?.confidence || 0.88, 1)}
                </div>
              </div>
            </div>

            {/* SHAP Feature Contribution Waterfall */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-1">Why Trustline Assessed This Borrower This Way</h3>
              <p className="text-xs text-slate-400 mb-5">
                SHAP feature attributions showing positive signals (risk-reducing) and adverse concerns (risk-increasing).
              </p>

              {data.latestAssessment?.contributions ? (
                <ContributionBars contributions={data.latestAssessment.contributions} maxBars={6} />
              ) : (
                <div className="text-xs text-slate-500 py-8 text-center">
                  SHAP feature contributions computed dynamically.
                </div>
              )}
            </div>
          </div>

          {/* Borrower 360 Information & Financial Behaviour */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Borrower Profile Details */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Borrower Demographics & Verified Profile</h3>
                </div>
                <Link
                  to={`/app/borrowers/${data.borrower.id}`}
                  className="text-xs text-blue-400 hover:underline font-medium"
                >
                  Full Profile →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Monthly Verifiable Income:</span>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{KES(data.borrower.monthlyIncome)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Segment Classification:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{SEGMENT_LABEL[data.borrower.segment]}</div>
                </div>
                <div>
                  <span className="text-slate-400">County Location:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{data.borrower.county}, Kenya</div>
                </div>
                <div>
                  <span className="text-slate-400">Employment Status:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{EMPLOYMENT_LABEL[data.borrower.employmentStatus]}</div>
                </div>
                <div>
                  <span className="text-slate-400">Residence Type:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{RESIDENCE_LABEL[data.borrower.residenceType]}</div>
                </div>
                <div>
                  <span className="text-slate-400">Dependants:</span>
                  <div className="font-semibold text-slate-200 mt-0.5">{data.borrower.dependants} persons</div>
                </div>
              </div>
            </div>

            {/* Alternative Cashflow & Telemetry */}
            <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Alternative Data Signals</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Repayment Consistency:</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                    {pct(data.borrower.repayment.repaymentConsistency, 0)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Cash Flow Utilisation:</span>
                  <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                    {pct(data.borrower.transactions.utilisationRatio, 0)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Mobile Account Tenure:</span>
                  <div className="font-bold text-white text-sm mt-0.5">
                    {data.borrower.accountTenureMonths} Months
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Monthly Transaction Count:</span>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">
                    {data.borrower.transactions.monthlyTransactionCount} / month
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Historical Max DPD:</span>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">
                    {data.borrower.repayment.daysPastDueMax} Days
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Prior Written-off Defaults:</span>
                  <div className="font-mono font-bold text-slate-200 mt-0.5">
                    {data.borrower.repayment.previousDefaults}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Confirmation Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">
              Confirm Decision: {pendingDecision?.toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <p className="text-slate-400">
              You are updating application <strong className="text-white">{id}</strong> to status{" "}
              <strong className="text-blue-400">{pendingDecision?.toUpperCase()}</strong>. Add underwriter rationale for the immutable audit log:
            </p>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-blue-500"
              placeholder="Enter underwriting notes..."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDecision}
              disabled={actionLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {actionLoading ? "Updating..." : "Commit Underwriting Action"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
