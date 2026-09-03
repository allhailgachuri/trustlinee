import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { DecisionBadge } from "@/components/shared/DecisionBadge";
import { LoadingState, EmptyState, ErrorState } from "@/components/shared/StateFeedback";
import { applicationsApi } from "@/api/applications";
import type { Application, Decision, RiskBand } from "@/lib/types";
import { KES, pct, shortDate, PURPOSE_LABEL } from "@/lib/format";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/applications/")({
  component: ApplicationsListPage,
});

function ApplicationsListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [riskBand, setRiskBand] = useState<RiskBand | "all">("all");
  const [decision, setDecision] = useState<Decision | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationsApi.getApplications({
        search,
        riskBand,
        decision,
        page,
        pageSize: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, riskBand, decision]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const handleExportCsv = () => {
    toast.success("Exporting applications dataset to CSV...");
    const headers = "ID,Borrower,Amount,Tenure,RiskScore,PD,RiskBand,Decision,Date\n";
    const rows = items
      .map(
        (a) =>
          `${a.id},"${a.borrowerName}",${a.amount},${a.tenureMonths},${a.riskScore},${(a.probabilityOfDefault * 100).toFixed(1)}%,${a.riskBand},${a.decision},${a.createdAt}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustline-applications-${Date.now()}.csv`;
    a.click();
  };

  return (
    <AppLayout
      title="Underwriting Applications"
      subtitle="Comprehensive registry of credit applications and underwriting decision records."
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <Link
            to="/app/risk-assessment"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Assessment</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or name..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </form>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={riskBand}
              onChange={(e) => {
                setRiskBand(e.target.value as any);
                setPage(1);
              }}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Risk Bands</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="severe">Severe Risk</option>
            </select>

            <select
              value={decision}
              onChange={(e) => {
                setDecision(e.target.value as any);
                setPage(1);
              }}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Decisions</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="referred">Referred</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingState message="Fetching underwriting applications..." />}
        {error && <ErrorState description={error} onRetry={fetchApplications} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="No applications found"
            description="Try relaxing your search terms or filter criteria."
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setRiskBand("all");
                  setDecision("all");
                }}
                className="text-xs text-blue-400 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            }
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Borrower Name</th>
                    <th className="py-3 px-4">Facility Amount</th>
                    <th className="py-3 px-4">Tenure</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">PD (%)</th>
                    <th className="py-3 px-4">Risk Band</th>
                    <th className="py-3 px-4">Decision</th>
                    <th className="py-3 px-4">Origination Date</th>
                    <th className="py-3 px-4 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => navigate({ to: `/app/applications/${app.id}` })}
                      className="cursor-pointer transition-colors hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-blue-400">{app.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{app.borrowerName}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-200">{KES(app.amount)}</td>
                      <td className="py-3 px-4 text-slate-400">{app.tenureMonths} mos</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{app.riskScore}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{pct(app.probabilityOfDefault, 1)}</td>
                      <td className="py-3 px-4">
                        <RiskBadge band={app.riskBand} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <DecisionBadge decision={app.decision} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-400">{shortDate(app.createdAt)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300">
                          Review <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
              <div>
                Showing <span className="font-semibold text-white">{items.length}</span> of{" "}
                <span className="font-semibold text-white">{total}</span> records
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span className="font-mono text-xs">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
