import { ExternalLink, TrendingUp } from "lucide-react";
import Link from "next/link";

import type { TrendingTopic } from "@/types/dashboard";

export function HotTopicsCard({ topics }: { topics: TrendingTopic[] }) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-heading">
        <h2 className="dashboard-card-title">Hot Topics</h2>
        <Link href="/dashboard/trending" className="dashboard-card-link">
          View all <ExternalLink className="size-[11px]" />
        </Link>
      </div>
      <div className="dashboard-topic-list">
        {topics.map((topic, index) => (
          <div key={topic.name} className="dashboard-topic">
            <span className="dashboard-topic-rank">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="dashboard-topic-name">{topic.name}</p>
              <div className="dashboard-topic-volume">
                <div className="dashboard-topic-track">
                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${(topic.count / 5000) * 100}%`,
                      backgroundColor: topic.color,
                    }}
                  />
                </div>
                <span className="dashboard-topic-count">
                  {topic.count.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="dashboard-topic-growth">
              <TrendingUp className="size-[11px]" />
              <span>{topic.growth}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
