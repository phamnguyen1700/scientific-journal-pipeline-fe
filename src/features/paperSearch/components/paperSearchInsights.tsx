"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Globe2,
  Tags,
  UserRound,
} from "lucide-react";

import type { PaperSearchFacetItem, PaperSearchFacets } from "@/types/search";

export function PaperSearchInsights({
  facets,
  total,
  onSelectKeyword,
  onSelectYear,
}: {
  facets: PaperSearchFacets;
  total: number;
  onSelectKeyword: (keyword: string) => void;
  onSelectYear: (year: number) => void;
}) {
  const openAccessTotal = facets.openAccess.total || total;
  const openAccessRate = openAccessTotal
    ? Math.round((facets.openAccess.count / openAccessTotal) * 1000) / 10
    : 0;

  return (
    <aside className="paper-search-insights" aria-label="Related search information">
      <InsightPanel title="Year" icon={<CalendarDays />}>
        {facets.years.length ? (
          <YearBars items={facets.years} onSelectYear={onSelectYear} />
        ) : (
          <InsightEmpty />
        )}
      </InsightPanel>

      <InsightPanel title="Open Access" icon={<Globe2 />}>
        <div className="paper-search-open-access">
          <div className="paper-search-open-access-ring" style={{ "--oa": `${openAccessRate}%` } as CSSProperties}>
            <span />
          </div>
          <div>
            <strong>{openAccessRate}%</strong>
            <span>{facets.openAccess.count.toLocaleString()} papers</span>
          </div>
        </div>
      </InsightPanel>

      <FacetPanel title="Topic" icon={<Tags />} items={facets.topics} onSelect={onSelectKeyword} />
      <FacetPanel title="Journal" icon={<BookOpen />} items={facets.journals} onSelect={onSelectKeyword} />
      <FacetPanel title="Author" icon={<UserRound />} items={facets.authors} onSelect={onSelectKeyword} />
      <FacetPanel title="Type" icon={<FileText />} items={facets.types} onSelect={onSelectKeyword} />
    </aside>
  );
}

function InsightPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="paper-search-insight-panel">
      <div className="paper-search-insight-heading">
        <span>{icon}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function FacetPanel({
  title,
  icon,
  items,
  onSelect,
}: {
  title: string;
  icon: ReactNode;
  items: PaperSearchFacetItem[];
  onSelect: (keyword: string) => void;
}) {
  return (
    <InsightPanel title={title} icon={icon}>
      {items.length ? (
        <div className="paper-search-facet-list">
          {items.slice(0, 5).map((item) => (
            <button key={item.label} type="button" onClick={() => onSelect(item.label)}>
              <span>{item.label}</span>
              <strong>{item.count.toLocaleString()}</strong>
            </button>
          ))}
        </div>
      ) : (
        <InsightEmpty />
      )}
    </InsightPanel>
  );
}

function YearBars({
  items,
  onSelectYear,
}: {
  items: PaperSearchFacetItem[];
  onSelectYear: (year: number) => void;
}) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="paper-search-year-bars">
      {items.slice(-18).map((item) => {
        const year = Number(item.label);

        return (
          <button
            key={item.label}
            type="button"
            style={{ height: `${Math.max(12, (item.count / max) * 84)}px` }}
            title={`${item.label}: ${item.count.toLocaleString()} papers`}
            onClick={() => Number.isFinite(year) && onSelectYear(year)}
            aria-label={`${item.label}: ${item.count.toLocaleString()} papers`}
          />
        );
      })}
    </div>
  );
}

function InsightEmpty() {
  return <p className="paper-search-insight-empty">No data yet</p>;
}
