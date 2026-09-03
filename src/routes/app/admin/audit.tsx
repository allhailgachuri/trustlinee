import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { adminApi } from "@/api/admin";
import type { AuditEvent } from "@/lib/types";
import { dateTime } from "@/lib/format";
import { ArrowLeft, CheckCircle2, History, Search, Shield, XCircle } from "lucide-react";

export const Route = createFileRoute("/app/admin/audit")({
  component: AdminAuditPage,
});

function AdminAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAuditEvents({ search, entity: entityFilter });
      setEvents(res);
    } catch (err: any) {
      setError(err.message || "Failed to load audit events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, [entityFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAudit();
  };

  return (
    <AppLayout
      title="Compliance Audit Stream"
      subtitle="Immutable event log recording all underwriting decisions, credit assessments, policy changes, and access grants."
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
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-md">
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, ID..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Entities</option>
              <option value="Application">Application</option>
              <option value="Assessment">Assessment</option>
              <option value="Report">Report</option>
              <option value="User">User</option>
              <option value="Configuration">Configuration</option>
              <option value="Model">Model</option>
            </select>
          </div>
        </div>

        {loading && <LoadingState message="Streaming immutable compliance events..." />}
        {error && <ErrorState description={error} onRetry={fetchAudit} />}

        {!loading && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Action Taken</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Entity ID</th>
                    <th className="py-3 px-4 text-right">Execution Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-400">{dateTime(evt.timestamp)}</td>
                      <td className="py-3 px-4 font-semibold text-white">{evt.user}</td>
                      <td className="py-3 px-4 text-slate-200">{evt.action}</td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-blue-300">
                          {evt.entity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{evt.entityId}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            evt.result === "success"
                              ? "text-emerald-400"
                              : evt.result === "pending"
                                ? "text-amber-400"
                                : "text-rose-400"
                          }`}
                        >
                          {evt.result === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          <span className="capitalize">{evt.result}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
