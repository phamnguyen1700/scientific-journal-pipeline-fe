import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { BookmarkedPaper } from "@/types/dashboard";

export function BookmarksCard({ papers }: { papers: BookmarkedPaper[] }) {
  return (
    <section className="dashboard-list-card">
      <div className="dashboard-list-header">
        <h2 className="dashboard-card-title">Bookmarks</h2>
        <Link href="/dashboard/bookmarks" className="dashboard-card-link">
          View all <ArrowUpRight className="size-[11px]" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {papers.map((paper) => (
          <article key={paper.title} className="dashboard-bookmark">
            <p className="dashboard-bookmark-title">{paper.title}</p>
            <div className="dashboard-bookmark-meta">
              <span className="text-primary">{paper.journal}</span>
              <span>{paper.saved}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="dashboard-bookmark-total">47 papers saved total</p>
    </section>
  );
}
