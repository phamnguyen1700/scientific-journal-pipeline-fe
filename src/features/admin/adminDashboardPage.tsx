"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Clock,
  Database,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminDashboard } from "@/hooks/admin";
import type { AdminDashboardApiStatus, AdminDashboardRecentUser } from "@/types/admin";

export function AdminDashboardPage() {
  const { dashboard, loading, error, refetch, isFetching } = useAdminDashboard();
  const summary = dashboard?.summary;
  const userGrowthData = dashboard?.userGrowth ?? [];
  const apiCalls = dashboard?.apiCalls;
  const showApiCallsChart = Boolean(apiCalls?.trackingEnabled && apiCalls.dataPoints.length > 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform health, user management, and API monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={14} />
            Backend data
            <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <DashboardMessage
          title="Unable to load admin dashboard"
          message={error}
          action={
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          }
        />
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Total Users"
              value={formatNumber(summary?.totalUsers)}
              subtext={`+${formatNumber(summary?.newUsersThisWeek)} this week`}
              icon={<Users size={18} className="text-purple-600" />}
              iconClassName="bg-purple-100"
            />
            <KpiCard
              label="Researchers"
              value={formatNumber(summary?.researchers)}
              subtext={`+${formatNumber(summary?.newResearchersThisMonth)} this month`}
              icon={<TrendingUp size={18} className="text-blue-600" />}
              iconClassName="bg-blue-100"
            />
            <KpiCard
              label="APIs Connected"
              value={formatNumber(summary?.apisConnected)}
              subtext={`${formatNumber(summary?.degradedApis)} degraded`}
              icon={<Database size={18} className="text-emerald-600" />}
              iconClassName="bg-emerald-100"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">User Growth</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Monthly registrations by role</p>
            </div>
            <Link href="/admin/users" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Manage users <ArrowUpRight size={12} />
            </Link>
          </div>
          {loading ? (
            <ChartSkeleton />
          ) : userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C4CF1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6C4CF1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="researcherGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="students" name="Students" stroke="#6C4CF1" fill="url(#studentGrad)" />
                <Area type="monotone" dataKey="researchers" name="Researchers" stroke="#10B981" fill="url(#researcherGrad)" />
                <Area type="monotone" dataKey="lecturers" name="Lecturers" stroke="#F59E0B" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyPanel message="No user growth data is available yet." />
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <p className="font-semibold text-foreground">API Calls</p>
          </div>
          {loading ? (
            <ChartSkeleton />
          ) : showApiCallsChart ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={apiCalls?.dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${Number(value) / 1000}K`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                  formatter={(value) => [Number(value).toLocaleString(), "Calls"]}
                />
                <Bar dataKey="calls" fill="#6C4CF1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyPanel message={apiCalls?.message ?? "API call tracking is not enabled yet."} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentUsersList users={dashboard?.recentUsers ?? []} loading={loading} />
        <ApiStatusList apiStatuses={dashboard?.apiStatuses ?? []} loading={loading} />
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  subtext,
  icon,
  iconClassName,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>
        </div>
      </div>
    </div>
  );
}

function RecentUsersList({
  users,
  loading,
}: {
  users: AdminDashboardRecentUser[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="font-semibold text-foreground">Recent Registrations</p>
        <Link href="/admin/users" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <ListSkeleton rows={4} />
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.userId} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{user.username}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className={getRoleBadgeClass(user.roleName)}>{user.roleName}</span>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{formatDate(user.registeredAt)}</p>
              </div>
              <span
                className={`ml-2 h-2 w-2 shrink-0 rounded-full ${
                  user.isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
            </div>
          ))
        ) : (
          <EmptyList message="No recent registrations found." />
        )}
      </div>
    </div>
  );
}

function ApiStatusList({
  apiStatuses,
  loading,
}: {
  apiStatuses: AdminDashboardApiStatus[];
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <p className="font-semibold text-foreground">API Status</p>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          <ListSkeleton rows={4} />
        ) : apiStatuses.length > 0 ? (
          apiStatuses.map((api) => (
            <div key={`${api.name}-${api.baseUrl}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/30">
              <span className={`h-2 w-2 shrink-0 rounded-full ${getApiStatusDotClass(api.status)}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{api.name}</p>
                <p className="truncate text-xs text-muted-foreground">{api.message || api.baseUrl}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className={getApiStatusBadgeClass(api.status)}>{api.status}</span>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {api.latencyMs ? `Latency: ${api.latencyMs}ms` : "Latency: -"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <EmptyList message="No API status data is available yet." />
        )}
      </div>
    </div>
  );
}

function DashboardMessage({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 shrink-0" size={18} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-sm">{message}</p>
          {action}
        </div>
      </div>
    </div>
  );
}

function DashboardCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-28 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-[220px] animate-pulse rounded-lg bg-muted" />;
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-5 py-3.5">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function EmptyList({ message }: { message: string }) {
  return <div className="px-5 py-8 text-center text-sm text-muted-foreground">{message}</div>;
}

function getRoleBadgeClass(roleName: string) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (roleName === "Researcher") {
    return `${base} bg-blue-100 text-blue-700`;
  }

  if (roleName === "Lecturer") {
    return `${base} bg-sky-100 text-sky-700`;
  }

  if (roleName === "System Administrator") {
    return `${base} bg-amber-100 text-amber-700`;
  }

  return `${base} bg-purple-100 text-purple-700`;
}

function getApiStatusDotClass(status: AdminDashboardApiStatus["status"]) {
  if (status === "Operational") return "bg-emerald-500";
  if (status === "Degraded") return "bg-amber-500";

  return "bg-red-500";
}

function getApiStatusBadgeClass(status: AdminDashboardApiStatus["status"]) {
  const base = "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (status === "Operational") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "Degraded") return `${base} bg-amber-100 text-amber-700`;

  return `${base} bg-red-100 text-red-700`;
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString();
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
