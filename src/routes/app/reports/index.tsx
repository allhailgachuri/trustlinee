import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { reportsApi } from "@/api/reports";
import type { Report } from "@/lib/types";
import { shortDate } from "@/lib/format";
import {
  ArrowRight,
  Calendar,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Plus,
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

export const Route = createFileRoute("/app/reports/")({
  component: ReportsListPage,
});

function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate Report Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState<Report["type"]>("portfolio_risk");
  const [reportTitle, setReportTitle] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportsApi.getReports();
      setReports(res);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const title = reportTitle || `Generated ${reportType.replace(/_/g, " ").toUpperCase()} Report`;
      const created = await reportsApi.generateReport(reportType, title, dateRange);
      toast.success("Institutional risk report generated!");
      setModalOpen(false);
      setReportTitle("");
      await fetchReports();
      navigate({ to: `/app/reports/${created.id}` });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout
      title="Credit Risk Reports"
      subtitle="Executive portfolio digests, model validation summaries, and cohort loss analysis."
      actions={
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Generate Report</span>
        </button>
      }
    >
      {loading && <LoadingState message="Fetching credit risk reports..." />}
      {error && <ErrorState description={error} onRetry={fetchReports} />}

      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between space-y-5 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-blue-400">{r.id}</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400 border border-emerald-500/20">
                    {r.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{r.description}</p>
              </div>

              <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Reporting Window:</span>
                  <span className="text-slate-300 font-medium">{r.dateRange}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Author / Owner:</span>
                  <span className="text-slate-300 font-medium">{r.owner}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/app/reports/${r.id}`}
                    className="flex-1 text-center rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
                  >
                    View Executive Report
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Report Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-base font-bold">Generate Risk Report</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateReport} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Report Title (Optional)</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Q1 2026 Executive Credit Risk Digest"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="portfolio_risk">Portfolio Risk & Capital Exposure</option>
                <option value="borrower_risk">Borrower High-Risk Watchlist Audit</option>
                <option value="model_performance">Model Validation & Benchmark Performance</option>
                <option value="default_analysis">Segment Default Deep Dive</option>
                <option value="cohort">Cohort Vintage Loss Curve Analysis</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Date Window</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days (Q1 2026)">Last 90 Days (Q1 2026)</option>
                <option value="Full Year 2025">Full Year 2025</option>
                <option value="Custom Trailing 12 Months">Custom Trailing 12 Months</option>
              </select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={generating}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {generating ? "Compiling..." : "Generate Report"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
