"use client";
import { useEffect, useRef, useState } from "react";
import { Network, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { topicPalette } from "@/features/researcher/components/researcherData";
import { InfoMetric, MetricRow, ResearcherEmptyState, ResearcherLoadingState, ResearcherPageShell } from "@/features/researcher/components/researcherShared";
import { useTopicCoOccurrence } from "@/hooks/analytics";
import type { AnalyticsNetwork } from "@/types/analytics";

export function TopicClusterPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(0.72);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const topicNetworkQuery = useTopicCoOccurrence(50);
  const changeZoom = (delta: number) => setZoom((value) => Math.max(0.45, Math.min(2.2, Number((value + delta).toFixed(2)))));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setZoom((value) => Math.max(0.45, Math.min(2.2, Number((value + (event.deltaY > 0 ? -0.08 : 0.08)).toFixed(2)))));
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => canvas.removeEventListener("wheel", handleWheel);
  });

  if (topicNetworkQuery.isPending) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} /><ResearcherLoadingState label="Loading topic network" /></div>;
  }

  const liveNetwork = topicNetworkQuery.data;
  if (!liveNetwork?.nodes?.length || !liveNetwork.edges?.length) {
    return <div className="space-y-6 p-6"><ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} /><ResearcherEmptyState title="No topic connections found" description="The topic co-occurrence service returned no connected topics." /></div>;
  }
  const layout = layoutNetwork(liveNetwork);
  const activeNode = selected !== null ? layout.nodes.find((node) => node.id === selected) : null;
  const connectedIds = selected !== null ? new Set(layout.edges.filter((edge) => edge.source === selected || edge.target === selected).flatMap((edge) => [edge.source, edge.target])) : null;
  const visibleNodes = filterArea ? layout.nodes.filter((node) => node.area === filterArea) : layout.nodes;
  const visibleIds = new Set(visibleNodes.map((node) => node.id));
  const visibleEdges = layout.edges
    .filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    .filter((edge) => selected !== null || edge.rank < 120);
  const colorFor = (area: string) => layout.areas.find((item) => item.id === area)?.color ?? topicPalette.purple;
  const resetView = () => {
    setZoom(0.72);
    setPan({ x: 0, y: 0 });
    setSelected(null);
    setHovered(null);
  };
  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as Element | null)?.closest("[data-graph-node]")) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
      moved: false,
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePan = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    setPan({ x: drag.originX + dx, y: drag.originY + dy });
  };
  const endPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (drag?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      window.setTimeout(() => {
        dragStateRef.current = null;
      }, 0);
    }
    setIsPanning(false);
  };
  const toggleNodeSelection = (nodeId: number) => {
    if (dragStateRef.current?.moved) return;
    setSelected((current) => current === nodeId ? null : nodeId);
  };

  return (
    <div className="space-y-4 p-6">
      <ResearcherPageShell title="Topic Cluster Visualization" description="Interactive network of research topics and their relationships" icon={<Network size={18} className="text-primary" />} />
      <div className="flex flex-col gap-4 xl:flex-row">
        <div
          ref={canvasRef}
          className={`relative min-h-[560px] flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={endPan}
          onPointerCancel={endPan}
        >
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
            <button onClick={() => changeZoom(0.16)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 shadow-sm transition-colors hover:text-white"><ZoomIn size={14} /></button>
            <button onClick={() => changeZoom(-0.16)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 shadow-sm transition-colors hover:text-white"><ZoomOut size={14} /></button>
            <button onClick={resetView} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/90 text-slate-300 shadow-sm transition-colors hover:text-white"><RotateCcw size={14} /></button>
          </div>
          <div className="absolute bottom-3 left-3 z-10 rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300">
            Drag to pan - Scroll to zoom - {Math.round(zoom * 100)}%
          </div>
          <svg width="100%" viewBox="0 0 920 560" className="min-h-[560px]">
            <rect width="920" height="560" fill="#0F172A" />
            <g transform={`translate(${pan.x} ${pan.y}) translate(460 280) scale(${zoom}) translate(-460 -280)`}>
              {visibleEdges.map((edge) => {
                const first = layout.nodes.find((node) => node.id === edge.source);
                const second = layout.nodes.find((node) => node.id === edge.target);
                if (!first || !second) return null;
                const highlighted = connectedIds ? connectedIds.has(edge.source) && connectedIds.has(edge.target) : false;
                return <line key={`${edge.source}-${edge.target}-${edge.rank}`} x1={first.x} y1={first.y} x2={second.x} y2={second.y} stroke={highlighted ? "#C4B5FD" : "#64748B"} strokeWidth={highlighted ? 2 : 0.85} strokeOpacity={highlighted ? 0.78 : selected !== null ? 0.08 : 0.22} />;
              })}
              {visibleNodes.map((node) => {
                const isSelected = selected === node.id;
                const isHovered = hovered === node.id;
                const isConnected = connectedIds ? connectedIds.has(node.id) : true;
                const color = colorFor(node.area);
                const dimmed = selected !== null && !isConnected;

                return (
                  <g key={node.id} data-graph-node="true" transform={`translate(${node.x}, ${node.y})`} style={{ cursor: "pointer" }} onPointerDown={(event) => event.stopPropagation()} onClick={() => toggleNodeSelection(node.id)} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}>
                    {(isSelected || isHovered) && <circle r={node.r + 6} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.35} />}
                    <circle r={node.r} fill={color} fillOpacity={dimmed ? 0.16 : isSelected ? 1 : 0.9} stroke={isSelected ? "#F8FAFC" : "#1E293B"} strokeWidth={isSelected ? 2.5 : 1.5} />
                    <text textAnchor="middle" dy="0.35em" fontSize={node.r > 28 ? 9 : 7.5} fill={dimmed ? "#CBD5E1" : "white"} fontWeight={600} style={{ pointerEvents: "none", userSelect: "none" }}>
                      {shortenTopicLabel(node.label, node.r > 28 ? 15 : 11)}
                    </text>
                  </g>
                );
              })}
            </g>
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
            <MetricRow label="Connections shown" value={`${visibleEdges.length} of ${layout.edges.length}`} />
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
    const ring = 210 + (index % 4) * 52;
    const jitter = ((index * 37) % 29) - 14;
    return { id: index + 1, label: node.label, x: 460 + Math.cos(angle) * (ring + jitter), y: 280 + Math.sin(angle) * (ring - jitter), r: Math.max(11, Math.min(28, 9 + Math.sqrt(node.size || 1) * 2.2)), area: node.group || "Research", papers: node.size || 0 };
  });
  const edges = network.edges
    .map((edge) => ({ source: idMap.get(edge.source), target: idMap.get(edge.target), weight: edge.weight ?? 1 }))
    .filter((edge): edge is { source: number; target: number; weight: number } => edge.source !== undefined && edge.target !== undefined)
    .sort((first, second) => second.weight - first.weight)
    .map((edge, rank) => ({ ...edge, rank }));
  const areas = groups.map((group, index) => ({ id: group, label: group, color: colors[index % colors.length] }));
  return { nodes, edges, areas };
}

function shortenTopicLabel(label: string, maxLength = 14) {
  if (label.length <= maxLength) return label;

  const words = label.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const compact = words.slice(0, 2).join(" ");
    return compact.length <= maxLength ? compact : `${compact.slice(0, Math.max(3, maxLength - 3))}...`;
  }

  return `${label.slice(0, Math.max(3, maxLength - 3))}...`;
}
