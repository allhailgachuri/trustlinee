import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Activity, ArrowRight, CheckCircle2, Globe, HeartHandshake, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section className="pt-16 pb-20 border-b border-slate-800/80 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Mission & Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Trustline Insight
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-300">
            Building the next generation of alternative-data credit risk intelligence for emerging markets and digital lenders across Kenya and East Africa.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              The Mission: Closing the Credit Visibility Gap
            </h2>
            <p>
              In Kenya and across East Africa, millions of industrious micro-business owners, market traders, bodaboda operators, and smallholder farmers participate actively in the economy through digital mobile-money wallets and daily commercial activity. Yet when they seek credit to expand inventory or invest in equipment, traditional banking channels often turn them away due to the absence of formal bank debt histories.
            </p>
            <p>
              Trustline was conceived to bridge this divide. By transforming verified mobile transaction behaviour, inflow consistency, and repayment discipline into calibrated credit risk intelligence, we provide lenders with the rigorous analytical tools needed to lend responsibly to previously invisible borrowers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">Emerging Markets Focus</h3>
              <p className="text-xs text-slate-400">Tailored specifically for mobile-first, high-velocity cash flow economies.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">Ethical & Explainable</h3>
              <p className="text-xs text-slate-400">Zero black-box decisions. Mathematical feature attribution on every score.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 text-amber-400 border border-amber-500/20">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-base">Human in the Loop</h3>
              <p className="text-xs text-slate-400">Designed to empower underwriters and credit committees with decision support.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 space-y-6 text-center">
            <h3 className="text-2xl font-bold text-white">Experience the Evaluation Sandbox</h3>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Our live demo platform features 52 realistic synthetic borrower profiles in Kenyan Shillings (KES), complete repayment histories, automated risk calculations, and model validation dashboards.
            </p>
            <div className="pt-2">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg active:scale-95"
              >
                <span>Launch Evaluation Sandbox (1-Click)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
