import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { reportsApi } from "@/api/reports";
import type { ReportDetail } from "@/lib/types";
import { KES, pct, shortDate } from "@/lib/format";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Lightbulb,
  Printer,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/reports/$id")({
  component: ReportDetailPage,
});

function ReportDetailPage() {
  const { id } = useParams({ from: "/app/reports/$id" });
  const [data, setData] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    reportsApi
      .getReportById(id)
      .then((res) => {
        if (!res) throw new Error("Report not found");
        setData(res);
      })
      .catch((err) => setError(err.message || "Failed to load report"))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("Preparing institutional PDF export format...");
    window.print();
  };

  return (
    <AppLayout
      title={data ? data.title : "Report Detail"}
      subtitle={data ? `Generated on ${shortDate(data.generatedAt)} by ${data.owner}` : ""}
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/app/reports"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Reports</span>
          </Link>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      }
    >
      {loading && <LoadingState message={`Compiling report preview for ${id}...`} />}
      {error && <ErrorState description={error} />}

      {!loading && data && (
        <div className="max-w-5xl mx-auto space-y-8 print:p-0 print:max-w-none print:text-black">
          {/* Header Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl shadow-2xl space-y-4 print:border-none print:bg-white print:p-0">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-400">{data.id}</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Official Institutional Risk Digest
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{data.title}</h1>
            <p className="text-xs text-slate-300 leading-relaxed">{data.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800 pt-4">
              <span>Period: <strong className="text-slate-200">{data.dateRange}</strong></span>
              <span>•</span>
              <span>Prepared By: <strong className="text-slate-200">{data.owner}</strong></span>
              <span>•</span>
              <span>Classification: <strong className="text-emerald-400">Strictly Internal / Committee</strong></span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileCheck className="h-5 w-5 text-blue-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Executive Summary</h2>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              {data.executiveSummary.map((para, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px]">
                    {i + 1}
                  </span>
                  <p>{para}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Portfolio Core Metrics */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              2. Key Portfolio Indicators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.portfolioMetrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-400">{m.label}</div>
                  <div className="font-mono text-2xl font-bold text-white">{m.value}</div>
                  <div className="text-[10px] text-emerald-400">{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: High-Risk Exposure Watchlist */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              3. High-Risk Exposure Watchlist
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Borrower ID</th>
                    <th className="py-2.5 px-3">Borrower Name</th>
                    <th className="py-2.5 px-3">Monitored Exposure</th>
                    <th className="py-2.5 px-3">Model PD (%)</th>
                    <th className="py-2.5 px-3">Risk Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.highRiskExposure.map((b) => (
                    <tr key={b.borrowerId} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono text-blue-400">{b.borrowerId}</td>
                      <td className="py-3 px-3 font-semibold text-white">{b.name}</td>
                      <td className="py-3 px-3 font-mono">{KES(b.exposure)}</td>
                      <td className="py-3 px-3 font-mono text-rose-400">{pct(b.pd, 1)}</td>
                      <td className="py-3 px-3">
                        <RiskBadge band={b.band} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Key Findings & Strategic Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Key Diagnostic Findings</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {data.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Underwriting Recommendations</h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {data.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-[11px] text-slate-500 py-6 border-t border-slate-800">
            Generated by Trustline Insight Platform • Synthetic demonstration environment • All figures in KES.
          </div>
        </div>
      )}
    </AppLayout>
  );
}
