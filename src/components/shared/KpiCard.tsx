import type { KpiMetric } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KpiCardProps {
  metric: KpiMetric;
  className?: string;
  subValue?: string;
}

export function KpiCard({ metric, className, subValue }: KpiCardProps) {
  const isPositive = metric.intent === "positive";
  const isNegative = metric.intent === "negative";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {metric.label}
        </span>
        {metric.hint && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  aria-label={`Info about ${metric.label}`}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs font-normal bg-slate-950 text-slate-200 border-slate-800 shadow-xl">
                {metric.hint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {metric.value}
          </div>
          {subValue && (
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subValue}</div>
          )}
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium",
            isPositive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
            isNegative && "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
            !isPositive && !isNegative && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
          )}
        >
          {metric.change > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : metric.change < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <Minus className="h-3 w-3" />
          )}
          {metric.changeLabel}
        </span>
      </div>
    </div>
  );
}
