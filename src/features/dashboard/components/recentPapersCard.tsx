"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/ui/carousel";
import type { RecentPaper } from "@/types/dashboard";

export function RecentPapersCard({
  error,
  loading,
  papers,
}: {
  error?: string | null;
  loading?: boolean;
  papers: RecentPaper[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const hasMultiplePapers = papers.length > 1;

  useEffect(() => {
    if (!api || !hasMultiplePapers) return;

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => window.clearInterval(interval);
  }, [api, hasMultiplePapers]);

  return (
    <section className="dashboard-list-card dashboard-wide-card dashboard-recent-carousel">
      <div className="dashboard-list-header">
        <h2 className="dashboard-card-title">Recent Papers</h2>
        <div className="dashboard-recent-actions">
          <Link href="/dashboard/papers" className="dashboard-card-link">
            Search all <ArrowUpRight className="size-[11px]" />
          </Link>
        </div>
      </div>
      <div className="dashboard-carousel-body">
        {loading ? (
          <div className="dashboard-paper-empty">Loading recent papers...</div>
        ) : error ? (
          <div className="dashboard-paper-empty">{error}</div>
        ) : papers.length ? (
          <Carousel
            opts={{ align: "start", loop: hasMultiplePapers }}
            className="dashboard-carousel"
            setApi={setApi}
          >
            <CarouselContent>
              {papers.map((paper) => (
                <CarouselItem key={paper.id}>
                  <article className="dashboard-paper dashboard-carousel-paper">
                    <div className="dashboard-paper-content">
                      <div className="min-w-0 flex-1">
                        <Link href={`/dashboard/papers/${paper.id}`}>
                          <h3 className="dashboard-paper-title">
                            {paper.title}
                          </h3>
                        </Link>
                        <p className="dashboard-paper-authors">
                          {paper.authors}
                        </p>
                        <div className="dashboard-paper-meta">
                          <span className="font-medium text-primary">
                            {paper.journal}
                          </span>
                          <span>-</span>
                          <span>{paper.year}</span>
                          <span>-</span>
                          <span>{paper.citations} citations</span>
                        </div>
                      </div>
                      <div className="dashboard-paper-tags">
                        {paper.tags.map((tag) => (
                          <Tag key={tag} className="h-5 px-2 text-[10px]">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultiplePapers && (
              <>
                <CarouselPrevious className="dashboard-carousel-prev" />
                <CarouselNext className="dashboard-carousel-next" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="dashboard-paper-empty">No recent papers found.</div>
        )}
      </div>
    </section>
  );
}
