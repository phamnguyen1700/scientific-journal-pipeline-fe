"use client";

import { useState } from "react";
import { ExternalLink, Radio, Search, TrendingDown, TrendingUp } from "lucide-react";

import { JournalDetailDrawer } from "@/features/journals";
import { ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useJournalTracker } from "@/hooks/analytics";

export function JournalTrackerPage() {
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openAccessFilter, setOpenAccessFilter] = useState<"all" | "open" | "closed">("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"papers" | "citations" | "growth" | "year">("papers");
  const journalsQuery = useJournalTracker(20, 5);

  if (journalsQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Journal Tracker" description="Monitor journals with filters and deeper journal profiles" icon={<Radio size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading journal tracker" /></div>;
  }

  const journals = journalsQuery.data ?? [];
  const availableYears = Array.from(new Set(journals.map((journal) => journal.lastPublicationYear).filter((year): year is number => year !== null))).sort((a, b) => b - a);
  const filteredJournals = journals
    .filter((journal) => {
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !normalizedSearch ||
        journal.journalName.toLowerCase().includes(normalizedSearch) ||
        journal.topKeywords.some((keyword) => keyword.toLowerCase().includes(normalizedSearch));
      const matchesOpenAccess =
        openAccessFilter === "all" ||
        (openAccessFilter === "open" && journal.isOpenAccess) ||
        (openAccessFilter === "closed" && !journal.isOpenAccess);
      const matchesYear = yearFilter === "all" || journal.lastPublicationYear?.toString() === yearFilter;

      return matchesSearch && matchesOpenAccess && matchesYear;
    })
    .sort((first, second) => {
      if (sortBy === "citations") return second.citationCount - first.citationCount;
      if (sortBy === "growth") return second.growthPercentage - first.growthPercentage;
      if (sortBy === "year") return (second.lastPublicationYear ?? 0) - (first.lastPublicationYear ?? 0);

      return second.paperCount - first.paperCount;
    });

  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Journal Tracker" description="Monitor journals with filters and deeper journal profiles" icon={<Radio size={18} className="text-primary" />} />

      {!journals.length ? (
        <ResearcherEmptyState title="No journal tracker data" description="The journal tracker service returned no journals for the selected period." />
      ) : (
        <>
          <div className="grid gap-3 rounded-xl border border-border bg-card p-4 lg:grid-cols-[1fr_auto_auto_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search journal or keyword..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
            <select value={openAccessFilter} onChange={(event) => setOpenAccessFilter(event.target.value as "all" | "open" | "closed")} className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
              <option value="all">All access</option>
              <option value="open">Open access</option>
              <option value="closed">Closed access</option>
            </select>
            <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
              <option value="all">All years</option>
              {availableYears.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "papers" | "citations" | "growth" | "year")} className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
              <option value="papers">Sort by papers</option>
              <option value="citations">Sort by citations</option>
              <option value="growth">Sort by growth</option>
              <option value="year">Sort by last year</option>
            </select>
          </div>

          {!filteredJournals.length ? (
            <ResearcherEmptyState title="No journals match the filters" description="Try a broader search, access status, or publication year." />
          ) : (
            <div className="overflow-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    {["Journal", "Open Access", "Papers", "Citations", "Growth", "Last Year", "Top Keywords"].map((header) => (
                      <th key={header} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${["Journal", "Top Keywords"].includes(header) ? "text-left" : "text-right"}`}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJournals.map((journal) => (
                    <tr key={journal.journalId || journal.journalName} onClick={() => setSelectedJournalId(journal.journalId)} className="cursor-pointer transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{journal.journalName}</p>
                          {journal.homepageUrl ? (
                            <a href={journal.homepageUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="text-muted-foreground transition-colors hover:text-primary" aria-label={`Open ${journal.journalName}`}>
                              <ExternalLink size={12} />
                            </a>
                          ) : null}
                        </div>
                      </td>
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
                        <div className="flex max-w-[260px] flex-wrap gap-1">
                          {journal.topKeywords.length ? journal.topKeywords.map((keyword) => <span key={keyword} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{keyword}</span>) : <span className="text-xs text-muted-foreground">-</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <JournalDetailDrawer
            journalId={selectedJournalId}
            open={Boolean(selectedJournalId)}
            showPapers={false}
            onOpenChange={(open) => {
              if (!open) setSelectedJournalId(null);
            }}
          />
        </>
      )}
    </div>
  );
}
