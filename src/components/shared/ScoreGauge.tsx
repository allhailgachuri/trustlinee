import type { RiskBand } from "@/lib/types";
import { RISK_BAND_LABEL, pct } from "@/lib/format";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface ScoreGaugeProps {
  score: number; // 300 to 900
  probabilityOfDefault: number; // 0 to 1
  riskBand: RiskBand;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDetails?: boolean;
}

export function ScoreGauge({
  score,
  probabilityOfDefault,
  riskBand,
  size = "md",
  className,
  showDetails = true,
}: ScoreGaugeProps) {
  // Normalize score to percentage (300 -> 0%, 900 -> 100%)
  const minScore = 300;
  const maxScore = 900;
  const clampedScore = Math.max(minScore, Math.min(maxScore, score));
  const scorePercent = (clampedScore - minScore) / (maxScore - minScore);

  // SVG Arch properties: Semi-circle
  const strokeWidth = size === "sm" ? 8 : size === "md" ? 12 : 16;
  const radius = size === "sm" ? 45 : size === "md" ? 70 : 95;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - scorePercent);

  const getScoreColor = () => {
    if (riskBand === "low") return "#10b981"; // Emerald
    if (riskBand === "medium") return "#f59e0b"; // Amber
    if (riskBand === "high") return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2 + strokeWidth * 2}
          height={radius + strokeWidth * 2 + 10}
          viewBox={`0 0 ${radius * 2 + strokeWidth * 2} ${radius + strokeWidth * 2 + 10}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${
              radius * 2 + strokeWidth
            } ${radius + strokeWidth}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Active Score Arc */}
          <path
            d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${
              radius * 2 + strokeWidth
            } ${radius + strokeWidth}`}
            fill="none"
            stroke={getScoreColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="font-mono text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {score}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Score (300–900)
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 flex flex-col items-center gap-2">
          <RiskBadge band={riskBand} size={size === "lg" ? "lg" : "md"} />
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Est. Probability of Default:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {pct(probabilityOfDefault, 1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
