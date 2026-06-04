import { Clock } from "lucide-react";

export function DashboardHeader({ name }: { name: string }) {
  return (
    <div className="dashboard-page-header">
      <div>
        <h1 className="dashboard-page-title">Welcome back, {name}</h1>
        <p className="dashboard-page-description">
          Here&apos;s what&apos;s happening in your research world today.
        </p>
      </div>
      <div className="dashboard-updated">
        <Clock className="size-3" />
        Updated just now
      </div>
    </div>
  );
}
