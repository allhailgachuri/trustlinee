import type { SearchResults } from "@/lib/types";
import { applications, borrowers, loans } from "@/data/dataset";
import { KES } from "@/lib/format";
import { sleep } from "./client";

export const searchApi = {
  async search(query: string): Promise<SearchResults> {
    if (!query.trim()) {
      return { applications: [], borrowers: [], loans: [] };
    }

    await sleep(90);
    const q = query.toLowerCase();

    const matchedApps = applications
      .filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.borrowerName.toLowerCase().includes(q) ||
          a.borrowerId.toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        label: `${a.id} — ${a.borrowerName}`,
        sublabel: `${KES(a.amount)} • Risk: ${a.riskBand.toUpperCase()} • ${a.decision.toUpperCase()}`,
      }));

    const matchedBorrowers = borrowers
      .filter((b) => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.county.toLowerCase().includes(q))
      .slice(0, 5)
      .map((b) => ({
        id: b.id,
        label: `${b.name} (${b.id})`,
        sublabel: `${b.county} • Score: ${b.riskScore} • ${b.segment.replace(/_/g, " ")}`,
      }));

    const matchedLoans = loans
      .filter((l) => l.id.toLowerCase().includes(q) || l.borrowerId.toLowerCase().includes(q))
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        borrowerId: l.borrowerId,
        label: `${l.id} — ${KES(l.amount)}`,
        sublabel: `Borrower: ${l.borrowerId} • Status: ${l.status.toUpperCase()}`,
      }));

    return {
      applications: matchedApps,
      borrowers: matchedBorrowers,
      loans: matchedLoans,
    };
  },
};
