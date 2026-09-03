import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { LoadingState, EmptyState, ErrorState } from "@/components/shared/StateFeedback";
import { borrowersApi } from "@/api/borrowers";
import type { Borrower, RiskBand } from "@/lib/types";
import { KES, pct, shortDate, SEGMENT_LABEL } from "@/lib/format";
import { ArrowRight, ChevronLeft, ChevronRight, Download, Search, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/borrowers/")({
  component: BorrowersListPage,
});

function BorrowersListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Borrower[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<Borrower["segment"] | "all">("all");
  const [riskBand, setRiskBand] = useState<RiskBand | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await borrowersApi.getBorrowers({
        search,
        segment,
        riskBand,
        page,
        pageSize: 10,
        sortBy: "riskScore",
        sortOrder: "desc",
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load borrowers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, [page, segment, riskBand]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBorrowers();
  };

  const handleExportCsv = () => {
    toast.success("Exporting borrowers directory to CSV...");
    const headers = "ID,Name,Segment,County,RiskScore,PD,RiskBand,ActiveLoans,Defaults\n";
    const rows = items
      .map(
        (b) =>
          `${b.id},"${b.name}",${b.segment},"${b.county}",${b.riskScore},${(b.probabilityOfDefault * 100).toFixed(1)}%,${b.riskBand},${b.activeLoans},${b.repayment.previousDefaults}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustline-borrowers-${Date.now()}.csv`;
    a.click();
  };

  return (
    <AppLayout
      title="Borrower Directory"
      subtitle="360° credit profiles, historical cashflow behaviour, and ongoing risk monitoring."
      actions={
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      }
    >
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name, County..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={segment}
              onChange={(e) => {
                setSegment(e.target.value as any);
                setPage(1);
              }}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Segments</option>
              <option value="salaried">Salaried</option>
              <option value="micro_business">Micro Business</option>
              <option value="informal_trader">Informal Trader</option>
              <option value="smallholder_farmer">Smallholder Farmer</option>
            </select>

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
          </div>
        </div>

        {/* List Content */}
        {loading && <LoadingState message="Fetching borrower credit profiles..." />}
        {error && <ErrorState description={error} onRetry={fetchBorrowers} />}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="No borrowers found"
            description="Try changing your search keywords or filter criteria."
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Borrower ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Segment</th>
                    <th className="py-3 px-4">County</th>
                    <th className="py-3 px-4">Monthly Income</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">PD (%)</th>
                    <th className="py-3 px-4">Risk Band</th>
                    <th className="py-3 px-4">Active Facilities</th>
                    <th className="py-3 px-4 text-right">Credit Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => navigate({ to: `/app/borrowers/${b.id}` })}
                      className="cursor-pointer transition-colors hover:bg-slate-800/50"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-blue-400">{b.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{b.name}</td>
                      <td className="py-3 px-4 text-slate-300">{SEGMENT_LABEL[b.segment]}</td>
                      <td className="py-3 px-4 text-slate-400">{b.county}</td>
                      <td className="py-3 px-4 font-mono text-slate-200">{KES(b.monthlyIncome)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{b.riskScore}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{pct(b.probabilityOfDefault, 1)}</td>
                      <td className="py-3 px-4">
                        <RiskBadge band={b.riskBand} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{b.activeLoans}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300">
                          View 360° <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
              <div>
                Showing <span className="font-semibold text-white">{items.length}</span> of{" "}
                <span className="font-semibold text-white">{total}</span> borrowers
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
