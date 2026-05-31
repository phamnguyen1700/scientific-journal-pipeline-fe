export type CommonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CommonStatus =
  | "active"
  | "inactive"
  | "pending"
  | "error"
  | "warning";

export const statusStyles: Record<CommonStatus, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  pending: "bg-blue-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
};

export const statusLabels: Record<CommonStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  error: "Error",
  warning: "Warning",
};
