import { ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";

import type { TrendingTopic } from "@/types/dashboard";

export function HotTopicsCard({ topics }: { topics: TrendingTopic[] }) {
  const maxCount = Math.max(...topics.map((topic) => topic.count), 1);

  return (
    <section className="dashboard-card">
      <div className="dashboard-card-heading">
        <h2 className="dashboard-card-title">Hot Topics</h2>
        <Link href="/dashboard/topics" className="dashboard-card-link">
          View all <ExternalLink className="size-[11px]" />
        </Link>
      </div>
      <div className="dashboard-topic-list">
        {topics.length ? (
          topics.map((topic, index) => (
            <div key={topic.name} className="dashboard-topic">
              <span className="dashboard-topic-rank">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="dashboard-topic-name">{topic.name}</p>
                <div className="dashboard-topic-volume">
                  <div className="dashboard-topic-track">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.max((topic.count / maxCount) * 100, 4)}%`,
                        backgroundColor: topic.color,
                      }}
                    />
                  </div>
                  <span className="dashboard-topic-count">
                    {topic.count.toLocaleString()}
                  </span>
                </div>
              </div>
              {topic.growth !== undefined && (
                <div className="dashboard-topic-growth">
                  <TrendingUp className="size-[11px]" />
                  <span>{topic.growth}%</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="dashboard-paper-empty">No trending topics found.</div>
        )}
      </div>
    </section>
  );
}
