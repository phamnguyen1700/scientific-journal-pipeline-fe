"use client";

import { ExternalLink, Radio, TrendingDown, TrendingUp } from "lucide-react";

import { ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useJournalTracker } from "@/hooks/analytics";

export function JournalTrackerPage() {
  const journalsQuery = useJournalTracker(20, 5);

  if (journalsQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Journal Tracker" description="Monitor journal publication activity from indexed backend data" icon={<Radio size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading journal tracker" /></div>;
  }

  const journals = journalsQuery.data ?? [];

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Journal Tracker" description="Monitor journal publication activity from indexed backend data" icon={<Radio size={18} className="text-primary" />} />

      {!journals.length ? (
        <ResearcherEmptyState title="No journal tracker data" description="The journal tracker service returned no journals for the selected period." />
      ) : (
        <div className="overflow-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Journal", "Publisher", "Open Access", "Papers", "Citations", "Growth", "Last Year", "Top Keywords"].map((header) => (
                  <th key={header} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${["Journal", "Publisher", "Top Keywords"].includes(header) ? "text-left" : "text-right"}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {journals.map((journal) => (
                <tr key={journal.journalId || journal.journalName} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{journal.journalName}</p>
                      {journal.homepageUrl ? (
                        <a href={journal.homepageUrl} target="_blank" rel="noreferrer" className="text-muted-foreground transition-colors hover:text-primary" aria-label={`Open ${journal.journalName}`}>
                          <ExternalLink size={12} />
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{journal.publisher || "-"}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${journal.isOpenAccess ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                      {journal.isOpenAccess ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-foreground">{journal.paperCount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-foreground">{journal.citationCount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className={`flex items-center justify-end gap-1 text-xs font-medium ${journal.growthPercentage >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {journal.growthPercentage >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {journal.growthPercentage >= 0 ? "+" : ""}{journal.growthPercentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{journal.lastPublicationYear ?? "-"}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {journal.topKeywords.length ? journal.topKeywords.map((keyword) => <span key={keyword} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{keyword}</span>) : <span className="text-xs text-muted-foreground">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
