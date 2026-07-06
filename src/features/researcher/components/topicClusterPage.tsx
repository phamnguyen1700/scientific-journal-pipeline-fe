"use client";
import { useState } from "react";
import { Network, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { topicPalette } from "@/features/researcher/components/researcherData";
import { InfoMetric, MetricRow, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTopicCoOccurrence } from "@/hooks/analytics";
import type { AnalyticsNetwork } from "@/types/analytics";

export function TopicClusterPage() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const topicNetworkQuery = useTopicCoOccurrence(50);

  if (topicNetworkQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading topic network" /></div>;
  }

  const liveNetwork = topicNetworkQuery.data;
  if (!liveNetwork?.nodes?.length || !liveNetwork.edges?.length) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} /><ResearcherEmptyState title="No topic connections found" description="The topic co-occurrence service returned no connected topics." /></div>;
  }
  const layout = layoutNetwork(liveNetwork);
  const activeNode = selected !== null ? layout.nodes.find((node) => node.id === selected) : null;
  const connectedIds = selected !== null ? new Set(layout.edges.filter((edge) => edge.includes(selected)).flat()) : null;
  const visibleNodes = filterArea ? layout.nodes.filter((node) => node.area === filterArea) : layout.nodes;
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = layout.edges.filter((edge) => visibleIds.has(edge[0]) && visibleIds.has(edge[1]));
  const colorFor = (area: string) => layout.areas.find((item) => item.id === area)?.color ?? topicPalette.purple;

  return (
    <div className="space-y-4 p-6">
      <ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} />
      <div className="flex flex-col gap-4 xl:flex-row">
        <div className="relative min-h-[520px] flex-1 overflow-hidden rounded-xl border border-border bg-card">
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
            <button onClick={() => setZoom((value) => Math.min(2, value + 0.2))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom((value) => Math.max(0.5, value - 0.2))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"><ZoomOut size={14} /></button>
            <button onClick={() => { setZoom(1); setSelected(null); setHovered(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"><RotateCcw size={14} /></button>
          </div>
          <svg width="100%" viewBox="0 0 820 500" className="min-h-[520px] transition-transform" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
            {visibleEdges.map(([a, b], index) => {
              const first = layout.nodes.find((node) => node.id === a);
              const second = layout.nodes.find((node) => node.id === b);
              if (!first || !second) return null;
              const highlighted = connectedIds ? connectedIds.has(a) && connectedIds.has(b) : false;
              return <line key={`${a}-${b}-${index}`} x1={first.x} y1={first.y} x2={second.x} y2={second.y} stroke={highlighted ? topicPalette.purple : "#E5E7EB"} strokeWidth={highlighted ? 1.5 : 1} strokeOpacity={selected !== null && !highlighted ? 0.2 : 1} />;
            })}
            {visibleNodes.map((node) => {
              const isSelected = selected === node.id;
              const isHovered = hovered === node.id;
              const isConnected = connectedIds ? connectedIds.has(node.id) : true;
              const color = colorFor(node.area);
              const dimmed = selected !== null && !isConnected;

              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`} style={{ cursor: "pointer" }} onClick={() => setSelected((current) => current === node.id ? null : node.id)} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}>
                  {(isSelected || isHovered) && <circle r={node.r + 6} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.35} />}
                  <circle r={node.r} fill={color} fillOpacity={dimmed ? 0.15 : isSelected ? 1 : 0.85} stroke={isSelected ? color : "white"} strokeWidth={isSelected ? 2 : 1.5} />
                  <text textAnchor="middle" dy="0.35em" fontSize={node.r > 30 ? 10 : 8} fill={dimmed ? "#D1D5DB" : "white"} fontWeight="500" style={{ pointerEvents: "none", userSelect: "none" }}>
                    {node.label.length > 14 ? `${node.label.slice(0, 12)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:w-60 xl:grid-cols-1">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 text-xs font-semibold text-foreground">Research Areas</p>
            <div className="space-y-2">
              {layout.areas.map((area) => (
                <button key={area.id} onClick={() => setFilterArea((current) => current === area.id ? null : area.id)} className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors ${filterArea === area.id ? "bg-muted" : "hover:bg-muted/60"}`}>
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                  <span className="text-xs text-foreground">{area.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            {activeNode ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colorFor(activeNode.area) }} />
                  <p className="text-xs font-semibold text-foreground">{activeNode.label}</p>
                </div>
                <InfoMetric label="Publications" value={activeNode.papers.toLocaleString()} />
                <InfoMetric label="Research Area" value={layout.areas.find((area) => area.id === activeNode.area)?.label ?? "Research area"} />
                <InfoMetric label="Connected Topics" value={`${connectedIds ? connectedIds.size - 1 : 0} related topics`} />
              </div>
            ) : (
              <p className="text-center text-xs text-muted-foreground">Click a node to explore its connections and details.</p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-xs font-semibold text-foreground">Network Stats</p>
            <MetricRow label="Nodes" value={layout.nodes.length.toString()} />
            <MetricRow label="Connections" value={layout.edges.length.toString()} />
            <MetricRow label="Areas" value={layout.areas.length.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function layoutNetwork(network: AnalyticsNetwork) {
  const colors = [topicPalette.purple, topicPalette.emerald, topicPalette.blue, topicPalette.amber, topicPalette.red, topicPalette.violet];
  const groups = Array.from(new Set(network.nodes.map((node) => node.group || "Research")));
  const idMap = new Map(network.nodes.map((node, index) => [node.id, index + 1]));
  const nodes = network.nodes.map((node, index) => {
    const angle = (index / Math.max(network.nodes.length, 1)) * Math.PI * 2;
    const ring = 145 + (index % 3) * 35;
    return { id: index + 1, label: node.label, x: 410 + Math.cos(angle) * ring, y: 250 + Math.sin(angle) * ring, r: Math.max(14, Math.min(38, 10 + Math.sqrt(node.size || 1) * 3)), area: node.group || "Research", papers: node.size || 0 };
  });
  const edges = network.edges.map((edge) => [idMap.get(edge.source), idMap.get(edge.target)]).filter((edge): edge is [number, number] => edge[0] !== undefined && edge[1] !== undefined);
  const areas = groups.map((group, index) => ({ id: group, label: group, color: colors[index % colors.length] }));
  return { nodes, edges, areas };
}
