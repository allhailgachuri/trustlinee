import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { searchApi } from "@/api/search";
import type { SearchResults } from "@/lib/types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search, FileText, User, CreditCard, Loader2 } from "lucide-react";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ applications: [], borrowers: [], loans: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ applications: [], borrowers: [], loans: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.search(query);
        setResults(res);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    setQuery("");
    navigate({ to: path });
  };

  const hasResults =
    results.applications.length > 0 || results.borrowers.length > 0 || results.loans.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0 bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
        <div className="flex items-center border-b border-slate-800 px-3.5 py-3">
          <Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Application ID, Borrower Name, Loan ID, or County..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            autoFocus
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {!query && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type to instantly search across applications, borrowers, and facilities...
            </div>
          )}

          {query && !loading && !hasResults && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          )}

          {results.applications.length > 0 && (
            <div className="mb-3">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Applications
              </div>
              {results.applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelect(`/app/applications/${app.id}`)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                >
                  <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-white truncate">{app.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{app.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.borrowers.length > 0 && (
            <div className="mb-3">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Borrowers
              </div>
              {results.borrowers.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(`/app/borrowers/${b.id}`)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-white truncate">{b.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{b.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.loans.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Loan Facilities
              </div>
              {results.loans.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSelect(`/app/borrowers/${l.borrowerId}`)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-slate-800"
                >
                  <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-white truncate">{l.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{l.sublabel}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
