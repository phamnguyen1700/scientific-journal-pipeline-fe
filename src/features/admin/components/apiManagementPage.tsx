"use client";

import { useState } from "react";
import { Plus, RefreshCw, Eye, EyeOff, Copy, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { ManagedApi } from "@/types/admin";
import { mockApis } from "../index";

export function ApiManagementPage() {
  const [apis, setApis] = useState<ManagedApi[]>(mockApis);
  const [showKey, setShowKey] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const toggleKey = (id: string) => {
    setShowKey((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleEnabled = (id: string) => {
    setApis((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const stats = {
    connected: apis.filter((a) => a.status === "Connected").length,
    totalCalls: apis.reduce((sum, a) => sum + a.callsToday, 0),
    degraded: apis.filter((a) => a.status === "Degraded").length,
    avgLatency: "352ms",
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">API Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage external data source integrations and API keys
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} />
          Add API
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.connected}</p>
          <p className="text-xs text-muted-foreground">Connected APIs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.totalCalls.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Calls Today</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.degraded}</p>
          <p className="text-xs text-muted-foreground">Degraded</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{stats.avgLatency}</p>
          <p className="text-xs text-muted-foreground">Avg. Latency</p>
        </div>
      </div>

      {/* API Cards */}
      <div className="space-y-4">
        {apis.map((api) => {
          const usagePct = (api.callsToday / api.callsLimit) * 100;
          const statusColor =
            api.status === "Connected"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700";
          const statusIcon =
            api.status === "Connected" ? (
              <CheckCircle size={12} />
            ) : (
              <AlertCircle size={12} />
            );

          return (
            <div
              key={api.id}
              className={`rounded-xl border bg-card p-5 transition-all ${
                api.enabled ? "border-border" : "border-border opacity-60"
              }`}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5 flex items-center gap-3">
                    <p className="text-sm font-semibold text-foreground">{api.name}</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor}`}>
                      {statusIcon}
                      {api.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{api.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <RefreshCw size={12} />
                    Sync Now
                  </button>
                  {/* Toggle switch */}
                  <button
                    onClick={() => toggleEnabled(api.id)}
                    className={`relative h-5 w-10 rounded-full transition-colors ${
                      api.enabled ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        api.enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* API Key Row */}
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <span className="flex-1 text-xs font-mono text-muted-foreground">
                  {showKey.has(api.id)
                    ? api.key
                    : api.key.replace(/(?<=^.{8}).+(?=.{4}$)/g, "••••••••")}
                </span>
                <button
                  onClick={() => toggleKey(api.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showKey.has(api.id) ? (
                    <EyeOff size={13} />
                  ) : (
                    <Eye size={13} />
                  )}
                </button>
                <button
                  onClick={() => copyKey(api.id, api.key)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {copied === api.id ? (
                    <CheckCircle size={13} className="text-emerald-500" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>

              {/* Stats Row */}
              <div className="mb-3 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  Last sync: {api.lastSync}
                </div>
                <div>
                  Latency:{" "}
                  <span
                    className={`font-medium ${
                      api.status === "Degraded"
                        ? "text-amber-600"
                        : "text-foreground"
                    }`}
                  >
                    {api.latency}
                  </span>
                </div>
                <div>
                  Today:{" "}
                  <span className="font-medium text-foreground">
                    {api.callsToday.toLocaleString()}
                  </span>{" "}
                  / {api.callsLimit.toLocaleString()}
                </div>
              </div>

              {/* Usage Bar */}
              <div className="rounded-full h-1.5 bg-muted">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    usagePct > 85 ? "bg-amber-500" : "bg-primary"
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {usagePct.toFixed(1)}% of daily limit used
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
