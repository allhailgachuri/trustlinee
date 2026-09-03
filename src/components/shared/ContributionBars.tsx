import type { FeatureContribution } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, ShieldCheck, AlertTriangle } from "lucide-react";

interface ContributionBarsProps {
  contributions: FeatureContribution[];
  className?: string;
  maxBars?: number;
}

export function ContributionBars({ contributions, className, maxBars = 8 }: ContributionBarsProps) {
  const displayed = contributions.slice(0, maxBars);
  const maxAbs = Math.max(0.1, ...displayed.map((c) => Math.abs(c.contribution)));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Feature Contribution Breakdown (SHAP Values)
        </h4>
        <span className="text-[11px] text-slate-400">Magnitude relative to baseline</span>
      </div>

      <div className="space-y-3.5">
        {displayed.map((item) => {
          const isRiskIncreasing = item.direction === "increases_risk";
          const barWidthPercent = Math.min(100, Math.round((Math.abs(item.contribution) / maxAbs) * 100));

          return (
            <div
              key={item.feature}
              className="group rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-800 dark:hover:bg-slate-900/80"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-slate-200">
                  {isRiskIncreasing ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                  ) : (
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{item.value}</span>
                  <span
                    className={cn(
                      "inline-flex items-center font-mono text-xs font-semibold",
                      isRiskIncreasing ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {isRiskIncreasing ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {item.contribution > 0 ? `+${item.contribution.toFixed(2)}` : item.contribution.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Visual Bar */}
              <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isRiskIncreasing ? "bg-rose-500" : "bg-emerald-500",
                  )}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Interpretation copy */}
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {item.interpretation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
