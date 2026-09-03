import type { Decision } from "@/lib/types";
import { DECISION_LABEL, decisionClasses } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, HelpCircle, XCircle } from "lucide-react";

interface DecisionBadgeProps {
  decision: Decision;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function DecisionBadge({ decision, showIcon = true, className, size = "md" }: DecisionBadgeProps) {
  const icons: Record<Decision, typeof CheckCircle2> = {
    approved: CheckCircle2,
    rejected: XCircle,
    pending: Clock,
    referred: HelpCircle,
  };

  const Icon = icons[decision];

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-colors",
        decisionClasses(decision),
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {DECISION_LABEL[decision]}
    </span>
  );
}
