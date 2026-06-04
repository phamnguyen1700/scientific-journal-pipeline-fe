"use client";

import Link from "next/link";
import { Users, TrendingUp, Database, Activity, Clock, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const userGrowthData = [
  { month: "Jan", students: 1240, researchers: 320, admins: 8 },
  { month: "Feb", students: 1480, researchers: 380, admins: 9 },
  { month: "Mar", students: 1720, researchers: 440, admins: 9 },
  { month: "Apr", students: 2040, researchers: 510, admins: 10 },
  { month: "May", students: 2380, researchers: 590, admins: 11 },
  { month: "Jun", students: 2840, researchers: 680, admins: 12 },
];

const apiUsageData = [
  { month: "Jan", calls: 142000 },
  { month: "Feb", calls: 168000 },
  { month: "Mar", calls: 204000 },
  { month: "Apr", calls: 248000 },
  { month: "May", calls: 291000 },
  { month: "Jun", calls: 334000 },
];

const recentUsers = [
  { name: "Nguyen Thi Lan", email: "lan.nguyen@hust.edu.vn", role: "Student", joined: "2 hours ago", status: "Active" },
  { name: "Dr. Tran Van Minh", email: "minh.tran@vnu.edu.vn", role: "Researcher", joined: "5 hours ago", status: "Active" },
  { name: "Le Thu Huong", email: "huong.le@usth.edu.vn", role: "Student", joined: "1 day ago", status: "Pending" },
  { name: "Prof. Pham Duc Anh", email: "anh.pham@ioit.ac.vn", role: "Researcher", joined: "2 days ago", status: "Active" },
];

const apiStatus = [
  { name: "Semantic Scholar API", status: "Operational", latency: "124ms", calls: 84200 },
  { name: "CrossRef API", status: "Operational", latency: "98ms", calls: 62100 },
  { name: "OpenAlex API", status: "Operational", latency: "142ms", calls: 51400 },
  { name: "PubMed API", status: "Degraded", latency: "842ms", calls: 28400 },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform health, user management, and API monitoring</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock size={14} />
          Live data
          <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Users size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">3,532</p>
              <p className="mt-0.5 text-xs text-muted-foreground">+84 this week</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Researchers</p>
              <p className="text-2xl font-bold text-foreground">680</p>
              <p className="mt-0.5 text-xs text-muted-foreground">+24 this month</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Database size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">APIs Connected</p>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="mt-0.5 text-xs text-muted-foreground">1 degraded</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Activity size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">System Health</p>
              <p className="text-2xl font-bold text-foreground">97.4%</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Uptime 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* User Growth Chart */}
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
          <ResponsiveContainer width="100%" height={200}>
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* API Calls Chart */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-foreground">API Calls</p>
            <Link href="/admin/api" className="flex items-center gap-1 text-xs text-primary hover:underline">
              Manage <ArrowUpRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={apiUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} formatter={(v) => [(v as number).toLocaleString(), "Calls"]} />
              <Bar dataKey="calls" fill="#6C4CF1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-semibold text-foreground">Recent Registrations</p>
            <Link href="/admin/users" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${user.role === "Researcher" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {user.role}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{user.joined}</p>
                </div>
                <span className={`ml-2 h-2 w-2 rounded-full shrink-0 ${user.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* API Status */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <p className="font-semibold text-foreground">API Status</p>
            <Link href="/admin/api" className="text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-border">
            {apiStatus.map((api) => (
              <div key={api.name} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <span className={`h-2 w-2 rounded-full shrink-0 ${api.status === "Operational" ? "bg-emerald-500" : "bg-amber-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{api.name}</p>
                  <p className="text-xs text-muted-foreground">{api.calls.toLocaleString()} calls today</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${api.status === "Operational" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {api.status}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Latency: {api.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
