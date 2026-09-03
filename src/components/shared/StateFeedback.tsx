import { AlertTriangle, FileQuestion, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ message = "Loading credit risk intelligence...", className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex min-h-[220px] flex-col items-center justify-center p-8 text-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "No records found",
  description = "No items match your active filters or search query.",
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <FileQuestion className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load data",
  description = "An error occurred while fetching information from the risk API.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-red-900 dark:text-red-300">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-red-700/80 dark:text-red-400/80">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
