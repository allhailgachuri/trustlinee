import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { DemoBanner } from "@/components/shared/DemoBanner";
import { Activity, ArrowRight, Menu, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Product", to: "/product" },
    { label: "How It Works", to: "/how-it-works" },
    { label: "Alternative Data", to: "/alternative-data" },
    { label: "Explainability", to: "/explainability" },
    { label: "About", to: "/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
      <DemoBanner />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/25">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white">TRUSTLINE</span>
              <span className="hidden sm:inline-block ml-1.5 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                INSIGHT
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "transition-colors hover:text-white",
                    active ? "text-blue-400 font-semibold" : "text-slate-400",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/auth/login"
              className="rounded-lg px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/35 active:scale-95"
            >
              <span>1-Click Launch Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="border-b border-slate-800 bg-slate-950 px-4 py-5 md:hidden space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <Link
                to="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-lg border border-slate-800 py-2.5 text-xs font-medium text-slate-300"
              >
                Sign In
              </Link>
              <Link
                to="/app/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/30"
              >
                1-Click Launch Demo
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="font-bold text-white text-sm">TRUSTLINE INSIGHT</span>
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-400">
                Alternative-Data Credit Risk Intelligence Platform. Estimating probability of default using cash-flow, repayment behaviour and transparent machine learning.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Demonstration & Academic Sandbox (Kenya / East Africa Focus)</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Product</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link to="/product" className="hover:text-white transition-colors">Underwriting Engine</Link></li>
                <li><Link to="/alternative-data" className="hover:text-white transition-colors">Alternative Signals</Link></li>
                <li><Link to="/explainability" className="hover:text-white transition-colors">SHAP Explainability</Link></li>
                <li><Link to="/app/model-intelligence" className="hover:text-white transition-colors">Model Governance</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Platform</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Mission</Link></li>
                <li><Link to="/auth/demo" className="hover:text-white transition-colors">Evaluation Sandbox</Link></li>
                <li><Link to="/app/dashboard" className="hover:text-white transition-colors">Live Demo App</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Compliance</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li className="text-slate-400">Synthetic KES Dataset</li>
                <li className="text-slate-400">Human-in-the-Loop</li>
                <li className="text-slate-400">Fair Lending Guardrails</li>
                <li className="text-slate-400">FastAPI Ready Architecture</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>© 2026 Trustline Insight. Alternative-Data Credit Risk Intelligence.</div>
            <div className="flex gap-4">
              <span>Demo Mode</span>
              <span>•</span>
              <span>FastAPI Backend Ready</span>
              <span>•</span>
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
