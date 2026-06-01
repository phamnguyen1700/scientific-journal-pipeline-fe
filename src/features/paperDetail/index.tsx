"use client";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileText,
  Languages,
  Quote,
} from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { usePaper } from "@/hooks/papers";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

export function PaperDetailPage({ id }: { id: string }) {
  const paperQuery = usePaper(id);

  if (paperQuery.loading) {
    return <PaperDetailStatus title="Loading paper..." description="Fetching paper details from the server." />;
  }

  if (paperQuery.error || !paperQuery.paper) {
    return (
      <PaperDetailStatus
        title="Paper not found"
        description={paperQuery.error ?? "The requested paper is not available."}
      />
    );
  }

  const paper = toPaperSearchResult(paperQuery.paper, Number(id) - 1);

  return (
    <div className="paper-detail-page">
      <Link href="/dashboard/papers" className="paper-detail-back">
        <ArrowLeft /> Back to paper search
      </Link>

      <article className="paper-detail-card">
        <div className="paper-detail-heading">
          <div>
            <div className="paper-result-badges">
              {paper.openAccess && <Badge variant="success">Open Access</Badge>}
              {paper.retracted && <Badge variant="danger">Retracted</Badge>}
              {paper.paperType && <Badge variant="muted">{paper.paperType}</Badge>}
            </div>
            <h1 className="paper-detail-title">{paper.title}</h1>
            <p className="paper-detail-authors">{paper.authors.join(", ")}</p>
          </div>

          {paper.doi && (
            <Button
              render={<a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Open DOI <ExternalLink />
            </Button>
          )}
        </div>

        <div className="paper-detail-meta">
          <span><BookOpen />{paper.journal}</span>
          <span><CalendarDays />{paper.publicationDate ?? paper.year}</span>
          <span><Quote />{paper.citations.toLocaleString()} citations</span>
          <span><FileText />{paper.referenceCount.toLocaleString()} references</span>
          {paper.language && <span><Languages />{paper.language.toUpperCase()}</span>}
        </div>

        {paper.doi && <p className="paper-detail-doi">DOI: {paper.doi}</p>}

        <section className="paper-detail-section">
          <h2>Abstract</h2>
          <p>{paper.abstract}</p>
        </section>

        {paper.tags.length > 0 && (
          <div className="paper-result-tags">
            {paper.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        )}
      </article>
    </div>
  );
}

function PaperDetailStatus({ title, description }: { title: string; description: string }) {
  return (
    <div className="paper-detail-page">
      <Link href="/dashboard/papers" className="paper-detail-back">
        <ArrowLeft /> Back to paper search
      </Link>
      <div className="paper-search-empty">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
