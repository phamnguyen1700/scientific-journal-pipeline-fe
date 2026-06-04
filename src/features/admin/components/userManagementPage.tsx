"use client";

import { useState } from "react";
import { Plus, Search, ChevronDown, MoreHorizontal, Pencil } from "lucide-react";
import type { AdminUser, UserStatus } from "@/types/admin";
import { isAdminRole, type UserRole } from "@/types/role";
import { mockUsers } from "../index";

const statusColors: Record<UserStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};

const roleColors: Record<UserRole, string> = {
  Student: "bg-purple-100 text-purple-700",
  Lecturer: "bg-sky-100 text-sky-700",
  Researcher: "bg-blue-100 text-blue-700",
  "System Administrator": "bg-orange-100 text-orange-700",
  Admin: "bg-red-100 text-red-700",
};

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "Student" || u.role === "Lecturer").length,
    researchers: users.filter((u) => u.role === "Researcher").length,
    admins: users.filter((u) => isAdminRole(u.role)).length,
    suspended: users.filter((u) => u.status === "Suspended").length,
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setOpenMenu(null);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {users.length} total users registered on the platform
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.students}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.researchers}</p>
          <p className="text-xs text-muted-foreground">Researchers</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{stats.suspended}</p>
          <p className="text-xs text-muted-foreground">Suspended</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Researcher">Researcher</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Admin">Admin</option>
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary"
          >
            <option>All Statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">User</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Joined</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Papers</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-700"}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColors[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{user.joined}</td>
                <td className="px-5 py-3.5 text-right text-sm font-medium text-foreground">{user.papers}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil size={14} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                      {openMenu === user.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className="w-full px-4 py-2.5 text-left text-xs hover:bg-muted"
                          >
                            {user.status === "Active" ? "Suspend User" : "Activate User"}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No users found</div>
        )}
      </div>
    </div>
  );
}
