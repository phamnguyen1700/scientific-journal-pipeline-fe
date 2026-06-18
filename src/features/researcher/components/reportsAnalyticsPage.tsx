"use client";
import { Calendar, Download, Eye, FileText } from "lucide-react";
import { reports } from "@/features/researcher/components/researcherData";
import { ResearcherPageShell } from "@/features/researcher/components/researcherShared";

export function ReportsAnalyticsPage() {
  const typeColors: Record<string, string> = {
    "Trend Report": "bg-purple-100 text-purple-700",
    "Analytics Report": "bg-blue-100 text-blue-700",
    "Signal Report": "bg-amber-100 text-amber-700",
    "Research Study": "bg-emerald-100 text-emerald-700",
    "Network Report": "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <ResearcherPageShell title="Reports & Analytics" description="Generated research trend reports and analytical summaries" />
        <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <FileText size={15} /> Generate Report
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Reports", value: "15" },
          { label: "Generated This Month", value: "4" },
          { label: "Total Pages", value: "348" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="group flex flex-col gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-shadow hover:shadow-sm lg:flex-row lg:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <FileText size={16} className="text-secondary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">{report.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors[report.type]}`}>{report.type}</span>
                <span className="text-xs text-muted-foreground">-</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={11} />{report.generated}</span>
                <span className="text-xs text-muted-foreground">-</span>
                <span className="text-xs text-muted-foreground">{report.pages} pages</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {report.topics.map((topic) => <span key={topic} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{topic}</span>)}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><Eye size={12} /> Preview</button>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"><Download size={12} /> Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
