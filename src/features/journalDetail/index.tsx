"use client";

import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  ExternalLink,
  FileText,
  Hash,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { PaperResultCard } from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { useJournal } from "@/hooks/journals";
import { usePapers, usePapersByJournal } from "@/hooks/papers";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { Journal, JournalTopic, JournalYearCount } from "@/types/journals";
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
  const journal = journalQuery.journal;
  const fallbackJournalName = papers[0]?.journal;
  const journalName = journal?.name ?? fallbackJournalName ?? "Journal detail";
  const citationCount = journal?.citations ?? papers.reduce((total, paper) => total + paper.citations, 0);
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
              {journal?.openAccess !== null && journal?.openAccess !== undefined && (
                <Badge variant={journal.openAccess ? "success" : "muted"}>
                  {journal.openAccess ? "Open Access" : "Not Open Access"}
                </Badge>
              )}
              {journal?.core !== null && journal?.core !== undefined && (
                <Badge variant={journal.core ? "secondary" : "muted"}>
                  {journal.core ? "Core journal" : "Non-core"}
                </Badge>
              )}
              {journal?.type ? <span>{journal.type}</span> : null}
            </div>
            <h1 className="paper-detail-title">{journalName}</h1>
            <p className="paper-detail-authors">
              {formatJournalSubtitle(journal?.publisher, journal?.issnL, journal?.countryCode)}
            </p>
          </div>

          {journal?.homepageUrl && (
            <Button
              render={<a href={journal.homepageUrl} target="_blank" rel="noreferrer" />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Website <ExternalLink />
            </Button>
          )}
        </div>

        <div className="paper-detail-meta">
          <span><FileText />{(journal?.papers ?? papers.length).toLocaleString()} works</span>
          <span><Quote />{citationCount.toLocaleString()} total citations</span>
          <span><BarChart3 />h-index {formatValue(journal?.hIndex)}</span>
          <span><BookOpen />i10-index {formatValue(journal?.i10Index)}</span>
        </div>

        <section className="author-detail-kpis">
          <MetricCard label="Works" value={journal?.papers ?? papers.length} />
          <MetricCard label="Citations" value={citationCount} />
          <MetricCard label="OA works" value={journal?.openAccessPapers ?? "N/A"} />
          <MetricCard label="2y mean citedness" value={journal?.twoYearMeanCitedness ?? "N/A"} />
        </section>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><Hash /> Identifiers</h2>
            <JournalIdentifierList id={id} journal={journal} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><Sparkles /> Research topics</h2>
            <JournalTopicList topics={journal?.topics ?? []} />
          </section>
        </div>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><Building2 /> Source profile</h2>
            <JournalProfile journal={journal} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><BarChart3 /> Works by year</h2>
            <JournalYearBars counts={journal?.countsByYear ?? []} />
          </section>
        </div>
      </article>

      {journalQuery.error && !journalQuery.journal && (
        <div className="paper-search-empty">
          <h2>Journal detail unavailable</h2>
          <p>{journalQuery.error}</p>
        </div>
      )}

      <section className="paper-detail-section">
        <h2>Papers in this journal</h2>
        <p>{papers.length.toLocaleString()} related paper{papers.length === 1 ? "" : "s"} found for this journal.</p>
      </section>

      <RelatedPapers
        emptyLabel="No papers were found for this journal."
        error={error}
        papers={papers}
      />
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="author-detail-kpi">
      <span>{label}</span>
      <strong>{typeof value === "number" ? value.toLocaleString() : value}</strong>
    </div>
  );
}

function JournalIdentifierList({ journal, id }: { journal: Journal | null; id: string }) {
  const items = [
    ["Journal ID", id],
    ["ISSN-L", journal?.issnL],
    ["ISSN", journal?.issn.join(", ")],
    ["Country", journal?.countryCode],
  ].filter((item): item is [string, string] => typeof item[1] === "string" && Boolean(item[1]));

  if (!items.length) {
    return <p>Identifier data unavailable.</p>;
  }

  return (
    <div className="author-detail-list">
      {items.map(([label, value]) => (
        <div className="author-detail-list-item" key={label}>
          <div>
            <strong>{label}</strong>
            <span>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function JournalProfile({ journal }: { journal: Journal | null }) {
  const publicationRange = formatPublicationRange(journal?.firstPublicationYear, journal?.lastPublicationYear);
  const items = [
    ["Type", journal?.type],
    ["Host organization", journal?.hostOrganizationName],
    ["Publication years", publicationRange],
    ["DOAJ", journal?.inDoaj === null || journal?.inDoaj === undefined ? null : journal.inDoaj ? "Listed" : "Not listed"],
  ].filter((item): item is [string, string] => typeof item[1] === "string" && Boolean(item[1]));

  if (!items.length) {
    return <p>Source profile data unavailable.</p>;
  }

  return (
    <div className="author-detail-list">
      {items.map(([label, value]) => (
        <div className="author-detail-list-item" key={label}>
          <div>
            <strong>{label}</strong>
            <span>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function JournalTopicList({ topics }: { topics: JournalTopic[] }) {
  const visibleTopics = topics.slice(0, 5);
  const maxCount = Math.max(...visibleTopics.map((topic) => topic.count ?? 0), 1);

  if (!visibleTopics.length) {
    return <p>Topic data unavailable.</p>;
  }

  return (
    <div className="author-detail-topic-list">
      {visibleTopics.map((topic) => {
        const count = topic.count ?? 0;

        return (
          <div className="author-detail-topic" key={topic.id ?? topic.name}>
            <div className="author-detail-topic-row">
              <strong>{topic.name}</strong>
              <span>{count ? count.toLocaleString() : "N/A"}</span>
            </div>
            <div className="author-detail-topic-meta">{topic.subfield ?? topic.field ?? topic.domain}</div>
            <div className="author-detail-track">
              <span style={{ width: `${Math.max((count / maxCount) * 100, 6)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JournalYearBars({ counts }: { counts: JournalYearCount[] }) {
  const visibleCounts = counts.filter((count) => count.year).slice(-12);
  const maxWorks = Math.max(...visibleCounts.map((count) => count.worksCount), 1);

  if (!visibleCounts.length) {
    return <p>Yearly activity data unavailable.</p>;
  }

  return (
    <div className="author-detail-year-bars">
      {visibleCounts.map((count) => (
        <div className="author-detail-year-bar" key={count.year}>
          <span>{count.worksCount.toLocaleString()}</span>
          <div><i style={{ height: `${Math.max((count.worksCount / maxWorks) * 100, 8)}%` }} /></div>
          <em>{count.year}</em>
        </div>
      ))}
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

function formatJournalSubtitle(publisher?: string | null, issn?: string | null, countryCode?: string | null) {
  return [publisher ?? "Publisher information unavailable", issn ? `ISSN ${issn}` : null, countryCode]
    .filter(Boolean)
    .join(" - ");
}

function formatValue(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "N/A";
}

function formatPublicationRange(first?: number | null, last?: number | null) {
  if (!first && !last) return null;
  if (first && last && first !== last) return `${first}-${last}`;
  return String(first ?? last);
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
