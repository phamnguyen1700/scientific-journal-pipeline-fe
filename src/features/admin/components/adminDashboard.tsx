import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Database,
  ShieldCheck,
  Users,
  Workflow,
  Clock3,
  Activity,
  Gauge,
} from "lucide-react";

import { PageHeader, StatusBadge } from "@/components/common";

const userGrowth = [
  { month: "Jan", students: 1240, researchers: 320, admins: 8 },
  { month: "Feb", students: 1480, researchers: 380, admins: 9 },
  { month: "Mar", students: 1720, researchers: 440, admins: 9 },
  { month: "Apr", students: 2040, researchers: 510, admins: 10 },
  { month: "May", students: 2380, researchers: 590, admins: 11 },
  { month: "Jun", students: 2840, researchers: 680, admins: 12 },
] as const;

const apiStatus = [
  { name: "Semantic Scholar API", status: "active" as const, latency: "124ms", calls: 84200 },
  { name: "CrossRef API", status: "active" as const, latency: "98ms", calls: 62100 },
  { name: "OpenAlex API", status: "active" as const, latency: "142ms", calls: 51400 },
  { name: "PubMed API", status: "warning" as const, latency: "842ms", calls: 28400 },
] as const;

const recentUsers = [
  { name: "Nguyen Thi Lan", email: "lan.nguyen@hust.edu.vn", role: "Student", joined: "2 hours ago", status: "active" },
  { name: "Dr. Tran Van Minh", email: "minh.tran@vnu.edu.vn", role: "Researcher", joined: "5 hours ago", status: "active" },
  { name: "Le Thu Huong", email: "huong.le@usth.edu.vn", role: "Student", joined: "1 day ago", status: "pending" },
  { name: "Prof. Pham Duc Anh", email: "anh.pham@ioit.ac.vn", role: "Researcher", joined: "2 days ago", status: "active" },
] as const;

const syncTasks = [
  { label: "Metadata ingestion", detail: "23 sources synced", status: "active" },
  { label: "API cache refresh", detail: "Completed 4 min ago", status: "active" },
  { label: "User invitation queue", detail: "18 invites pending", status: "pending" },
  { label: "Rate limit monitor", detail: "62% daily quota used", status: "warning" },
] as const;

export function AdminDashboard() {
  const maxStudents = Math.max(...userGrowth.map((item) => item.students));

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration"
        description="Platform health, user management, and API monitoring."
        actions={
          <>
            <Link href="/dashboard" className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              User dashboard
              <ArrowUpRight size={14} />
            </Link>
          </>
        }
      />

      <section className="dashboard-kpi-grid">
        <article className="dashboard-kpi-card">
          <div className="dashboard-kpi__icon dashboard-kpi__icon--violet">
            <Users size={18} />
          </div>
          <div className="dashboard-kpi__content">
            <p className="dashboard-kpi__label">Total users</p>
            <p className="dashboard-kpi__value">3,532</p>
            <p className="dashboard-kpi__trend">+84 this week • Active across all roles</p>
          </div>
        </article>

        <article className="dashboard-kpi-card">
          <div className="dashboard-kpi__icon dashboard-kpi__icon--blue">
            <Activity size={18} />
          </div>
          <div className="dashboard-kpi__content">
            <p className="dashboard-kpi__label">Researchers</p>
            <p className="dashboard-kpi__value">680</p>
            <p className="dashboard-kpi__trend">+24 this month • Growing research cohort</p>
          </div>
        </article>

        <article className="dashboard-kpi-card">
          <div className="dashboard-kpi__icon dashboard-kpi__icon--emerald">
            <Database size={18} />
          </div>
          <div className="dashboard-kpi__content">
            <p className="dashboard-kpi__label">APIs connected</p>
            <p className="dashboard-kpi__value">4</p>
            <p className="dashboard-kpi__trend">1 service degraded</p>
          </div>
        </article>

        <article className="dashboard-kpi-card">
          <div className="dashboard-kpi__icon dashboard-kpi__icon--amber">
            <ShieldCheck size={18} />
          </div>
          <div className="dashboard-kpi__content">
            <p className="dashboard-kpi__label">System health</p>
            <p className="dashboard-kpi__value">97.4%</p>
            <p className="dashboard-kpi__trend">Stable • Uptime over 30 days</p>
          </div>
        </article>
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">User growth</p>
              <h2 className="dashboard-panel__title">Monthly registrations by role</h2>
            </div>
            <span className="dashboard-panel__meta">
              <Clock3 size={14} /> Live data
            </span>
          </div>

          <svg className="w-full h-64" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            <line x1="50" y1="150" x2="650" y2="150" stroke="#e5e7eb" strokeWidth="1" />
            <line x1="50" y1="100" x2="650" y2="100" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="50" y1="50" x2="650" y2="50" stroke="#f3f4f6" strokeWidth="1" />
            
            {/* Line path */}
            <polyline
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              points={userGrowth.map((item, idx) => {
                const x = 50 + (idx * 100);
                const y = 150 - (item.students / maxStudents) * 100;
                return `${x},${y}`;
              }).join(" ")}
            />
            
            {/* Fill area under line */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6c4cf1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#6c4cf1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M ${50 + (0 * 100)},${150 - (userGrowth[0].students / maxStudents) * 100} ${userGrowth.map((item, idx) => {
                const x = 50 + (idx * 100);
                const y = 150 - (item.students / maxStudents) * 100;
                return `L ${x},${y}`;
              }).join(" ")} L 650,150 Z`}
              fill="url(#lineGradient)"
            />
            
            {/* Data points and labels */}
            {userGrowth.map((item, idx) => {
              const x = 50 + (idx * 100);
              const y = 150 - (item.students / maxStudents) * 100;
              return (
                <g key={item.month}>
                  <circle cx={x} cy={y} r="4" fill="#6c4cf1" />
                  <text x={x} y={170} textAnchor="middle" className="text-[11px]" fill="#6b7280">{item.month}</text>
                  <text x={x} y={y - 10} textAnchor="middle" className="text-[11px] font-semibold" fill="#111827">{item.students.toLocaleString()}</text>
                </g>
              );
            })}
          </svg>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Operations</p>
              <h2 className="dashboard-panel__title">API status</h2>
            </div>
            <Gauge size={16} className="dashboard-panel__icon" />
          </div>

          <div className="space-y-4">
            {apiStatus.map((api) => (
              <div key={api.name} className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={["mt-1 size-2 rounded-full shrink-0", api.status === "active" ? "bg-emerald-500" : "bg-amber-500"].join(" ")} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{api.name}</p>
                    <p className="text-xs text-muted-foreground">{api.calls.toLocaleString()} calls today</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={["inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium capitalize", api.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"].join(" ")}>{api.status}</span>
                  <p className="mt-1 text-[10px] text-muted-foreground">Latency: {api.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">People</p>
              <h2 className="dashboard-panel__title">Recent registrations</h2>
            </div>
            <Link href="/admin/users" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="dashboard-list">
            {recentUsers.map((user) => (
              <div key={user.email} className="dashboard-list__item">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {user.name.charAt(0)}
                  </div>
                  <div className="dashboard-list__copy">
                    <p className="dashboard-list__title">{user.name}</p>
                    <p className="dashboard-list__subline">{user.email}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11px] font-medium text-foreground">{user.role}</p>
                  <p className="dashboard-list__time">{user.joined}</p>
                </div>
                <StatusBadge status={user.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <p className="dashboard-panel__eyebrow">Automation</p>
              <h2 className="dashboard-panel__title">Pipeline health</h2>
            </div>
            <Workflow size={16} className="dashboard-panel__icon" />
          </div>

          <div className="dashboard-health-list">
            {syncTasks.map((task) => (
              <div key={task.label} className="dashboard-health-item">
                <div>
                  <p className="dashboard-health-item__label">{task.label}</p>
                  <p className="dashboard-health-item__detail">{task.detail}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>

          <div className="dashboard-callout">
            <BarChart3 size={16} />
            <div>
              <p className="dashboard-callout__title">System is healthy</p>
              <p className="dashboard-callout__text">All critical jobs completed successfully and the platform is ready for use.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
