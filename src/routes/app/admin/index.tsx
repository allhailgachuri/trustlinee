import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState, ErrorState } from "@/components/shared/StateFeedback";
import { adminApi } from "@/api/admin";
import type { HealthComponent, User } from "@/lib/types";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  History,
  Lock,
  Plus,
  Shield,
  Sliders,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app/admin/")({
  component: AdminOverviewPage,
});

function AdminOverviewPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [health, setHealth] = useState<HealthComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([adminApi.getUsers(), adminApi.getSystemHealth()])
      .then(([u, h]) => {
        setUsers(u);
        setHealth(h);
      })
      .catch((err) => setError(err.message || "Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="System Administration"
      subtitle="Security controls, user permission management, risk policy enforcement, and audit logs."
    >
      {loading && <LoadingState message="Loading administration console..." />}
      {error && <ErrorState description={error} />}

      {!loading && (
        <div className="space-y-8">
          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/app/admin/users"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mb-3">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">User Management</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage institutional accounts, assign analyst & risk manager roles, and invite underwriters.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold pt-2 border-t border-slate-800/80">
                <span>{users.length} Active Users</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              to="/app/admin/risk-rules"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 mb-3">
                  <Sliders className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Risk Policies & Rules</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect probability-of-default cutoff boundaries, decision logic, and model safeguards.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800/80">
                <span>XGBoost v1.4.0 Live</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              to="/app/admin/audit"
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20 mb-3">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Compliance Audit Log</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Immutable event stream recording every underwriting decision, score calculation, and policy change.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold pt-2 border-t border-slate-800/80">
                <span>Immutable Stream</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          {/* System Services Health Matrix */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">System Infrastructure & Microservice Health</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">100% System Availability</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {health.map((svc) => (
                <div key={svc.name} className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{svc.name}</span>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-slate-400 text-[11px]">{svc.detail}</p>
                  <div className="font-mono text-[10px] text-blue-400 pt-1 border-t border-slate-800/80">
                    Latency: {svc.latencyMs}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
