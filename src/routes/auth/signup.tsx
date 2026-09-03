import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Activity, ArrowRight, Building, CheckCircle2, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/auth";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("risk_manager");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration received! Instant Evaluation Sandbox access generated.");
    await authApi.loginDemo(role as any);
    navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-slate-100 font-sans">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xl font-black text-white">TRUSTLINE</span>
          </Link>
          <h1 className="text-2xl font-bold text-white pt-2">Institutional Sandbox Request</h1>
          <p className="text-xs text-slate-400">Deploy credit risk intelligence for your lending organization</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Mutiso"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel@lakeviewsacco.co.ke"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Organization Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. Lakeview Microfinance SACCO"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 pl-9 text-xs text-white placeholder-slate-600 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-300">Primary Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
              >
                <option value="admin">Chief Risk Officer / Admin</option>
                <option value="risk_manager">Senior Credit Risk Manager</option>
                <option value="analyst">Credit Underwriting Analyst</option>
                <option value="viewer">Executive Committee (Viewer)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              Initialize Evaluation Sandbox
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            <span>Already have credentials? </span>
            <Link to="/auth/login" className="text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
