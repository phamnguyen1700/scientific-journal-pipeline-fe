"use client";

import type { AnalyticsKeyValue } from "@/types/analytics";

export function CitationRankingChart({
  color = "#6C4CF1",
  emptyLabel = "No citation data found.",
  items,
  title,
}: {
  color?: string;
  emptyLabel?: string;
  items: AnalyticsKeyValue[];
  title: string;
}) {
  const data = items.slice(0, 8);
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="dashboard-card citation-ranking-card">
      <div className="dashboard-card-heading">
        <div>
          <h2 className="dashboard-card-title">{title}</h2>
          <p className="dashboard-card-description">
            Ranked by total citations
          </p>
        </div>
      </div>

      {data.length ? (
        <div className="citation-ranking-bars">
          {data.map((item, index) => {
            const width = Math.max((item.value / maxValue) * 100, 8);

            return (
              <div
                key={item.key}
                className="citation-ranking-item"
                tabIndex={0}
              >
                <div className="citation-ranking-row">
                  <span className="citation-ranking-rank">{index + 1}</span>
                  <div className="citation-ranking-track">
                    <div
                      className="citation-ranking-fill"
                      style={{
                        width: `${width}%`,
                        backgroundColor: color,
                      }}
                    >
                      <span>{item.key}</span>
                    </div>
                  </div>
                  <strong>{compactNumber(item.value)}</strong>
                </div>
                <span className="citation-ranking-tooltip">
                  {item.key}: {item.value.toLocaleString()} citations
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dashboard-paper-empty">{emptyLabel}</div>
      )}
    </section>
  );
}

function compactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}
