import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  Check,
  ExternalLink,
  FileText,
  Hash,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { ResearchTopicBars, WorksByYearChart } from "@/components/common";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { Journal, JournalPaper, JournalTopic, JournalYearCount } from "@/types/journals";

export function JournalDetailContent({
  error,
  followed = false,
  journal,
  loading,
  savingFollow = false,
  showPapers = true,
  onToggleFollow,
}: {
  error: string | null;
  followed?: boolean;
  journal: Journal | null;
  loading: boolean;
  savingFollow?: boolean;
  showPapers?: boolean;
  onToggleFollow?: () => void;
}) {
  if (loading) {
    return (
      <JournalDetailStatus
        title="Loading journal..."
        description="Fetching journal details from the server."
      />
    );
  }

  if (error && !journal) {
    return <JournalDetailStatus title="Journal detail unavailable" description={error} />;
  }

  if (!journal) {
    return (
      <JournalDetailStatus
        title="Journal not found"
        description="The requested journal is not available."
      />
    );
  }

  const countsByYear = parseCountsByYear(journal.countsByYear);
  const papers = journal.papers ?? [];

  return (
    <>
      <article className="paper-detail-card">
        <div className="paper-detail-heading">
          <div className="min-w-0">
            <div className="paper-result-badges">
              <span>Journal</span>
              <Badge variant={journal.isOpenAccess ? "success" : "muted"}>
                {journal.isOpenAccess ? "Open Access" : "Not Open Access"}
              </Badge>
              <Badge variant={journal.isCore ? "secondary" : "muted"}>
                {journal.isCore ? "Core journal" : "Non-core"}
              </Badge>
              {journal.journalTypeNavigation?.displayName ? (
                <span>{journal.journalTypeNavigation.displayName}</span>
              ) : journal.journalType ? (
                <span>{journal.journalType}</span>
              ) : null}
            </div>
            <h1 className="paper-detail-title">{journal.journalName}</h1>
            <p className="paper-detail-authors">
              {formatJournalSubtitle(journal.normalizedName, journal.firstPublicationYear, journal.lastPublicationYear)}
            </p>
          </div>
          {onToggleFollow ? (
            <Button
              type="button"
              variant={followed ? "soft" : "default"}
              size="sm"
              className="journal-detail-follow-button"
              aria-pressed={followed}
              disabled={savingFollow}
              onClick={onToggleFollow}
            >
              {followed ? <Check /> : <Bell />}
              {followed ? "Followed" : "Follow"}
            </Button>
          ) : null}
        </div>

        <div className="paper-detail-meta">
          <span><FileText />{journal.worksCount.toLocaleString()} works</span>
          <span><Quote />{journal.citedByCount.toLocaleString()} total citations</span>
          <span><BarChart3 />h-index {formatValue(journal.hIndex)}</span>
          <span><BookOpen />i10-index {formatValue(journal.i10Index)}</span>
        </div>

        <section className="author-detail-kpis">
          <MetricCard label="Works" value={journal.worksCount} />
          <MetricCard label="Citations" value={journal.citedByCount} />
          <MetricCard label="OA works" value={journal.oaWorksCount ?? "N/A"} />
          <MetricCard label="2y mean citedness" value={journal.twoYearMeanCitedness ?? "N/A"} />
        </section>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><Hash /> Identifiers</h2>
            <JournalIdentifierList journal={journal} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><Sparkles /> Research topics</h2>
            <JournalTopicList topics={journal.topics} />
          </section>
        </div>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><Building2 /> Source profile</h2>
            <JournalProfile journal={journal} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><BarChart3 /> Works by year</h2>
            <JournalYearBars counts={countsByYear} />
          </section>
        </div>
      </article>

      {showPapers ? (
        <>
          <section className="paper-detail-section">
            <h2>Papers in this journal</h2>
            <p>
              {papers.length.toLocaleString()} related paper{papers.length === 1 ? "" : "s"} found for this journal.
            </p>
          </section>

          <JournalPaperList papers={papers} />
        </>
      ) : null}
    </>
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

function JournalIdentifierList({ journal }: { journal: Journal }) {
  const items = [
    ["Journal ID", journal.journalId],
    ["Type ID", journal.journalTypeId],
    ["Normalized name", journal.normalizedName],
  ].filter((item): item is [string, string] => typeof item[1] === "string" && Boolean(item[1]));

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

function JournalProfile({ journal }: { journal: Journal }) {
  const items = [
    ["Type", journal.journalTypeNavigation?.displayName ?? journal.journalType],
    ["Publication years", formatPublicationRange(journal.firstPublicationYear, journal.lastPublicationYear)],
    ["DOAJ", journal.isInDoaj ? "Listed" : "Not listed"],
    ["Source updated", formatDate(journal.sourceUpdatedDate)],
  ].filter((item): item is [string, string] => typeof item[1] === "string" && Boolean(item[1]));

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
  return (
    <ResearchTopicBars
      items={topics.map((topic) => ({
        id: topic.journalTopicId ?? topic.topicId,
        title: topic.topicName,
        count: topic.worksCount ?? 0,
      }))}
    />
  );
}
function JournalYearBars({ counts }: { counts: JournalYearCount[] }) {
  return (
    <WorksByYearChart
      items={counts.map((count) => ({
        year: count.year,
        worksCount: getYearWorks(count),
      }))}
    />
  );
}
function JournalPaperList({ papers }: { papers: JournalPaper[] }) {
  if (!papers.length) {
    return <div className="paper-search-empty"><h2>No related papers</h2><p>No papers were found for this journal.</p></div>;
  }

  return (
    <div className="paper-search-result-list">
      {papers.map((paper) => (
        <article className="paper-result-card" key={paper.paperId}>
          <div className="paper-result-heading">
            <div className="min-w-0 flex-1">
              <div className="paper-result-badges">
                {paper.isOpenAccess ? <Badge variant="success">Open Access</Badge> : <Badge variant="muted">Paper</Badge>}
                {paper.paperType ? <span>{paper.paperType}</span> : null}
                <span>{paper.publicationYear ?? "N/A"}</span>
              </div>
              <Link href={`/dashboard/papers/${paper.paperId}`}>
                <h2 className="paper-result-title">{paper.title}</h2>
              </Link>
              <p className="paper-result-authors">{getPaperAuthors(paper).join(", ")}</p>
            </div>
          </div>
          <div className="paper-result-footer">
            <div className="paper-result-meta">
              <span><Quote />{paper.citedByCount.toLocaleString()} citations</span>
              <span><FileText />{paper.referenceCount.toLocaleString()} references</span>
            </div>
            <Link href={`/dashboard/papers/${paper.paperId}`} className="paper-result-link">
              View details <ExternalLink />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function JournalDetailStatus({ title, description }: { title: string; description: string }) {
  return (
    <div className="paper-search-empty">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

function parseCountsByYear(value: Journal["countsByYear"]): JournalYearCount[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getYearWorks(count: JournalYearCount) {
  return count.worksCount ?? count.works_count ?? 0;
}

function getPaperAuthors(paper: JournalPaper) {
  const authors = (paper.paperAuthors ?? [])
    .map((author) => author.authorName ?? author.rawAuthorName)
    .filter((author): author is string => Boolean(author));

  return authors.length ? authors : ["Author information unavailable"];
}

function formatJournalSubtitle(name: string | null, firstYear: number | null, lastYear: number | null) {
  return [name ?? "Source information unavailable", formatPublicationRange(firstYear, lastYear)]
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

function formatDate(value: string | null) {
  if (!value) return null;

  return value.slice(0, 10);
}
