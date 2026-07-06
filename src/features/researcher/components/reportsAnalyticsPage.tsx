import { ResearcherEmptyState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";

export function ReportsAnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <ResearcherPageShell title="Reports & Analytics" description="Research report generation will appear here when backend support is available" />

      <div className="rounded-xl border border-border bg-card p-8">
        <ResearcherEmptyState
          title="Report generation is not available yet"
          description="The backend handoff does not include a reports analytics endpoint, so this page no longer displays generated mock reports."
        />
      </div>
    </div>
  );
}
