import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth";
import { Activity, ArrowRight, CheckCircle2, Lock, Mail, Shield, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sarah.kimani@demo.trustline.io");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);

  const handleInstantDemoLogin = async () => {
    setLoading(true);
    try {
      await authApi.loginDemo("admin");
      toast.success("Welcome, Dr. Sarah Kimani! Logged into Evaluation Sandbox.");
      navigate({ to: "/app/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.login(email, password);
      toast.success("Authentication successful");
      navigate({ to: "/app/dashboard" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-slate-100 font-sans antialiased">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">TRUSTLINE</span>
          </Link>
          <h1 className="text-2xl font-bold text-white pt-2">Credit Risk Intelligence</h1>
          <p className="text-xs text-slate-400">Institutional Underwriting & Governance Portal</p>
        </div>

        {/* 1-Click Sandbox Fast Track Box */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/40 p-5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span>EVALUATION SANDBOX • 1-CLICK ACCESS</span>
            </div>
            <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
              Super Admin
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
              SK
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white">Dr. Sarah Kimani</div>
              <div className="text-[11px] text-slate-400 truncate">Head of Credit Risk / Admin</div>
            </div>
          </div>
          <button
            onClick={handleInstantDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
          >
            <UserCheck className="h-4 w-4" />
            <span>1-Click Launch Evaluation Sandbox</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Standard Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-300">Password</label>
                <Link to="/auth/forgot-password" className="text-[11px] text-blue-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-white hover:bg-slate-750 transition-colors"
            >
              Sign In with Institutional ID
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
            <span>Need institutional sandbox?</span>
            <Link to="/auth/signup" className="text-blue-400 font-semibold hover:underline">
              Request Institution Access
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
