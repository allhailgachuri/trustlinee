import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth";
import type { UserRole } from "@/lib/types";
import { Activity, ArrowRight, CheckCircle2, Shield, Sparkles, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/demo")({
  component: DemoAccessPage,
});

function DemoAccessPage() {
  const navigate = useNavigate();

  const personas: { role: UserRole; name: string; title: string; description: string }[] = [
    {
      role: "admin",
      name: "Dr. Sarah Kimani",
      title: "Chief Risk Officer / Super Admin",
      description: "Full system administration, user management, risk threshold rules, audit logs, and underwriting review.",
    },
    {
      role: "risk_manager",
      name: "Peter Kimeu",
      title: "Senior Risk Manager",
      description: "Portfolio oversight, underwriting escalations, model drift inspection, and cohort performance analysis.",
    },
    {
      role: "analyst",
      name: "Grace Onyango",
      title: "Credit Underwriting Analyst",
      description: "Individual loan application assessments, SHAP vector inspection, and borrower detail evaluation.",
    },
    {
      role: "viewer",
      name: "Fatuma Ali",
      title: "Executive Committee Viewer",
      description: "Read-only access to portfolio analytics, executive risk reports, and high-level KPI trends.",
    },
  ];

  const handleSelectPersona = async (role: UserRole, name: string) => {
    await authApi.loginDemo(role);
    toast.success(`Logged in as ${name} (${role.toUpperCase()})`);
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white">TRUSTLINE</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Evaluation Sandbox</h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300">
            Select a test persona or click below to explore the complete Trustline platform with preloaded synthetic borrower datasets.
          </p>
        </div>

        {/* 1-Click Fast Launcher */}
        <div className="rounded-3xl border border-blue-500/30 bg-blue-950/40 p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span>Recommended Fast Track</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Instant Supervisor Access</h2>
            <p className="text-xs text-slate-300 max-w-md">
              Launch directly into the dashboard with full administrative permissions to test every screen, model, and underwriting tool.
            </p>
          </div>
          <button
            onClick={() => handleSelectPersona("admin", "Dr. Sarah Kimani")}
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-xs font-bold text-white shadow-xl shadow-blue-600/40 hover:bg-blue-500 transition-all active:scale-95"
          >
            <UserCheck className="h-4 w-4" />
            <span>Launch Evaluation Sandbox</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Personas Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or select specific role persona:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personas.map((p) => (
              <div
                key={p.role}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{p.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono uppercase text-blue-400">
                      {p.role.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-0.5">{p.title}</div>
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">{p.description}</p>
                </div>
                <button
                  onClick={() => handleSelectPersona(p.role, p.name)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-750 transition-colors"
                >
                  Enter as {p.name.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-300">
            ← Back to public homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
