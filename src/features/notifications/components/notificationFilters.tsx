import { cn } from "@/lib/utils";
import type { NotificationFilter } from "@/types/notifications";

const filters: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" }, { value: "unread", label: "Unread" },
  { value: "paper", label: "New papers" }, { value: "citation", label: "Citations" },
  { value: "keyword", label: "Keywords" }, { value: "journal", label: "Journals" },
];

export function NotificationFilters({ active, onChange }: { active: NotificationFilter; onChange: (filter: NotificationFilter) => void }) {
  return <div className="notification-filters">{filters.map((filter) => <button key={filter.value} type="button" className={cn("notification-filter", active === filter.value && "notification-filter-active")} onClick={() => onChange(filter.value)}>{filter.label}</button>)}</div>;
}
