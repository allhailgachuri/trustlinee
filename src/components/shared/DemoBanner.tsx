import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex items-center justify-between border-b border-amber-200/60 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-900 backdrop-blur-md dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-semibold uppercase tracking-wider text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
          EVALUATION SANDBOX
        </span>
        <span>
          Simulated demonstration environment (Currency in KES). No real-world credit claims.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="rounded p-0.5 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
