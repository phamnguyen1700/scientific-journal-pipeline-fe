"use client";
import { useState } from "react";
import { Bell, BellOff, Plus, Radio, TrendingDown, TrendingUp } from "lucide-react";
import { keywordAlerts, trackedJournals } from "@/features/researcher/components/researcherData";
import { ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTopJournalsByCitations, useTopJournalsByPaperCount } from "@/hooks/analytics";

export function JournalTrackerPage() {
  const [fallbackJournals, setFallbackJournals] = useState(trackedJournals);
  const [journalAlerts, setJournalAlerts] = useState<Record<number, boolean>>({});
  const [alertList, setAlertList] = useState(keywordAlerts);
  const [activeTab, setActiveTab] = useState<"journals" | "keywords">("journals");
  const papersQuery = useTopJournalsByPaperCount(20);
  const citationsQuery = useTopJournalsByCitations(20);

  const journalList = papersQuery.data?.length
    ? papersQuery.data.map((journal, index) => ({
      id: index + 1,
      name: journal.key,
      publisher: "Indexed journal",
      impactFactor: null,
      papers: journal.value,
      growth: 0,
      alert: journalAlerts[index + 1] ?? false,
      keywords: citationsQuery.data?.some((item) => item.key === journal.key) ? ["Citation data available"] : [],
      lastUpdated: "Live",
    }))
    : fallbackJournals;

  function toggleJournalAlert(id: number) {
    if (papersQuery.data?.length) {
      setJournalAlerts((current) => ({ ...current, [id]: !current[id] }));
      return;
    }
    setFallbackJournals((current) => current.map((item) => item.id === id ? { ...item, alert: !item.alert } : item));
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <ResearcherPageShell title="Journal & Keyword Tracker" description="Monitor journals and keywords with real-time alerts" icon={<Radio size={18} className="text-primary" />} />
      </div>
      <div className="flex w-fit gap-1 rounded-xl bg-muted p-1">
        {(["journals", "keywords"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === "journals" ? `Journals (${journalList.length})` : `Keyword Alerts (${alertList.length})`}
          </button>
        ))}
      </div>
      {activeTab === "journals" ? (
        <div className="overflow-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Journal", "Publisher", "Impact Factor", "Papers / Year", "Growth", "Keywords", "Updated", "Alert"].map((header) => (
                  <th key={header} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${["Journal", "Publisher", "Keywords"].includes(header) ? "text-left" : "text-right"}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {journalList.map((journal) => (
                <tr key={journal.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3.5"><p className="text-sm font-semibold text-foreground">{journal.name}</p></td>
                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{journal.publisher}</td>
                  <td className="px-4 py-3.5 text-right">{journal.impactFactor !== null ? <span className="text-sm font-medium text-foreground">{journal.impactFactor}</span> : <span className="text-xs text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-foreground">{journal.papers}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className={`flex items-center justify-end gap-1 text-xs font-medium ${journal.growth >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {journal.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {journal.growth >= 0 ? "+" : ""}{journal.growth}%
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex max-w-[180px] flex-wrap gap-1">
                      {journal.keywords.map((keyword) => <span key={keyword} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{keyword}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-muted-foreground">{journal.lastUpdated}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button onClick={() => toggleJournalAlert(journal.id)} className={`rounded-lg p-1.5 transition-colors ${journal.alert ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`} aria-label={`${journal.alert ? "Disable" : "Enable"} alert for ${journal.name}`}>
                      {journal.alert ? <Bell size={14} /> : <BellOff size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <Plus size={15} /> Create Alert
            </button>
          </div>
          {alertList.map((alert) => (
            <div key={alert.keyword} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-shadow hover:shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">&quot;{alert.keyword}&quot;</p>
                  {alert.active && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Active</span>}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{alert.journals} journals monitored</span>
                  <span>-</span>
                  <span>{alert.papers} papers matched last 30 days</span>
                </div>
              </div>
              <button onClick={() => setAlertList((current) => current.map((item) => item.keyword === alert.keyword ? { ...item, active: !item.active } : item))} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${alert.active ? "bg-primary/10 text-primary" : "border border-border text-muted-foreground hover:bg-muted"}`}>
                {alert.active ? <><Bell size={12} /> Enabled</> : <><BellOff size={12} /> Disabled</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
