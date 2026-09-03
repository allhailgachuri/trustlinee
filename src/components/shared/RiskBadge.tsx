import type { RiskBand } from "@/lib/types";
import { RISK_BAND_LABEL, riskBandClasses } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  band: RiskBand;
  showDot?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ band, showDot = true, className, size = "md" }: RiskBadgeProps) {
  const dotColors: Record<RiskBand, string> = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    severe: "bg-red-500",
  };

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium uppercase tracking-wider transition-colors",
        riskBandClasses(band),
        sizeClasses[size],
        className,
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[band])} />
      )}
      {RISK_BAND_LABEL[band]}
    </span>
  );
}
