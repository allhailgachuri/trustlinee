import { Outlet, Link, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, FileQuestion, RefreshCw } from "lucide-react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-blue-500 shadow-2xl">
        <FileQuestion className="h-10 w-10 text-brand" />
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          404
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        That credit record doesn't exist.
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        The application, borrower profile, or report you are trying to view could not be located in the credit risk registry.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/app/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-brand/90 hover:shadow-brand/20 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          Explore Trustline
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
      <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <RefreshCw className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Service Error Encountered</h2>
        <p className="mt-2 text-xs text-slate-400">
          An unexpected error occurred while processing this risk intelligence view.
        </p>
        <div className="mt-4 rounded-lg bg-slate-950 p-3 text-left font-mono text-xs text-red-300 break-words border border-slate-800">
          {error.message || "Unknown error"}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand/90"
          >
            <RefreshCw className="h-4 w-4" />
            Retry View
          </button>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center rounded-lg border border-slate-800 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
