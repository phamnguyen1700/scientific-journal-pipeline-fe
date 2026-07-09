"use client";

import { ArrowLeft, BookOpen, ExternalLink, FileText, Quote } from "lucide-react";
import Link from "next/link";

import { PaperResultCard } from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { useJournal } from "@/hooks/journals";
import { usePapers, usePapersByJournal } from "@/hooks/papers";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { PaperApiModel } from "@/types/papers";

export function JournalDetailPage({ id }: { id: string }) {
  const journalQuery = useJournal(id);
  const journalPapersQuery = usePapersByJournal(id);
  const allPapersQuery = usePapers();
  const relatedRawPapers = mergePapers(
    journalPapersQuery.papers,
    allPapersQuery.papers.filter((paper) => paper.journalId === id)
  );
  const papers = relatedRawPapers.map(toPaperSearchResult);
  const fallbackJournalName = papers[0]?.journal;
  const journalName = journalQuery.journal?.name ?? fallbackJournalName ?? "Journal detail";
  const citationCount = papers.reduce((total, paper) => total + paper.citations, 0);
  const loading = journalQuery.loading && journalPapersQuery.loading && allPapersQuery.loading;
  const error = papers.length ? null : journalPapersQuery.error ?? allPapersQuery.error;

  if (loading) {
    return <JournalDetailStatus title="Loading journal..." description="Fetching journal details from the server." />;
  }

  return (
    <div className="paper-detail-page">
      <Link href="/dashboard/papers" className="paper-detail-back">
        <ArrowLeft /> Back to paper search
      </Link>

      <article className="paper-detail-card">
        <div className="paper-detail-heading">
          <div>
            <div className="paper-result-badges">
              <span>Journal</span>
              {journalQuery.journal?.openAccess !== null && journalQuery.journal?.openAccess !== undefined && (
                <Badge variant={journalQuery.journal.openAccess ? "success" : "muted"}>
                  {journalQuery.journal.openAccess ? "Open Access" : "Not Open Access"}
                </Badge>
              )}
              {journalQuery.journal?.core !== null && journalQuery.journal?.core !== undefined && (
                <Badge variant={journalQuery.journal.core ? "secondary" : "muted"}>
                  {journalQuery.journal.core ? "Core journal" : "Non-core"}
                </Badge>
              )}
            </div>
            <h1 className="paper-detail-title">{journalName}</h1>
            <p className="paper-detail-authors">
              {formatJournalSubtitle(journalQuery.journal?.publisher, journalQuery.journal?.issnL)}
            </p>
          </div>

          {journalQuery.journal?.homepageUrl && (
            <Button
              render={<a href={journalQuery.journal.homepageUrl} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Website <ExternalLink />
            </Button>
          )}
        </div>

        <div className="paper-detail-meta">
          <span><FileText />{papers.length.toLocaleString()} related papers</span>
          <span><Quote />{citationCount.toLocaleString()} total citations</span>
          <span><BookOpen />Journal ID: {id}</span>
        </div>

        <section className="paper-detail-section">
          <h2>Papers in this journal</h2>
          <p>{papers.length.toLocaleString()} related paper{papers.length === 1 ? "" : "s"} found for this journal.</p>
        </section>
      </article>

      {journalQuery.error && !journalQuery.journal && (
        <div className="paper-search-empty">
          <h2>Journal detail unavailable</h2>
          <p>{journalQuery.error}</p>
        </div>
      )}

      <RelatedPapers
        emptyLabel="No papers were found for this journal."
        error={error}
        papers={papers}
      />
    </div>
  );
}

function RelatedPapers({
  emptyLabel,
  error,
  papers,
}: {
  emptyLabel: string;
  error: string | null;
  papers: ReturnType<typeof toPaperSearchResult>[];
}) {
  if (error) {
    return <div className="paper-search-empty"><h2>Unable to load papers</h2><p>{error}</p></div>;
  }

  if (papers.length === 0) {
    return <div className="paper-search-empty"><h2>No related papers</h2><p>{emptyLabel}</p></div>;
  }

  return (
    <div className="paper-search-result-list">
      {papers.map((paper, index) => (
        <PaperResultCard key={`${paper.id}-${index}`} paper={paper} onToggleBookmark={() => undefined} />
      ))}
    </div>
  );
}

function mergePapers(...groups: PaperApiModel[][]) {
  const seen = new Set<string>();
  const merged: PaperApiModel[] = [];

  for (const paper of groups.flat()) {
    const key = paper.id || paper.paperId || paper.doi || paper.title;
    if (!key || seen.has(key)) continue;

    seen.add(key);
    merged.push(paper);
  }

  return merged;
}

function formatJournalSubtitle(publisher?: string | null, issn?: string | null) {
  return [publisher ?? "Publisher information unavailable", issn ? `ISSN ${issn}` : null]
    .filter(Boolean)
    .join(" · ");
}

function JournalDetailStatus({ title, description }: { title: string; description: string }) {
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
