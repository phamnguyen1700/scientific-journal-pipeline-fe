"use client";

import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { PaperResultCard } from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { useAuthor } from "@/hooks/authors";
import { usePapers, usePapersByAuthor } from "@/hooks/papers";
import type {
  AuthorAffiliation,
  AuthorDetail,
  AuthorInstitution,
  AuthorSourceSpecificData,
  AuthorTopic,
  AuthorYearCount,
} from "@/types/authors";
import type { PaperApiModel, PaperAuthor } from "@/types/papers";

export function AuthorDetailPage({ id }: { id: string }) {
  const authorQuery = useAuthor(id);
  const authorPapersQuery = usePapersByAuthor(id);
  const allPapersQuery = usePapers();
  const relatedRawPapers = mergePapers(
    (authorQuery.author?.paperAuthors ?? [])
      .map((paperAuthor) => paperAuthor.paper)
      .filter((paper): paper is PaperApiModel => Boolean(paper)),
    authorPapersQuery.papers,
    allPapersQuery.papers.filter((paper) => hasAuthor(paper, id))
  );
  const papers = relatedRawPapers.map(toPaperSearchResult);
  const author = authorQuery.author;
  const openAlex = getOpenAlexData(author);
  const affiliations = parseList<AuthorAffiliation>(author?.affiliations) ?? openAlex.affiliations;
  const lastKnownInstitutions = parseList<AuthorInstitution>(author?.lastKnownInstitutions) ?? openAlex.last_known_institutions;
  const topics = openAlex.topics ?? [];
  const concepts = openAlex.x_concepts ?? [];
  const countsByYear = openAlex.counts_by_year ?? [];
  const authorName = author?.displayName ?? findAuthorName(relatedRawPapers, id) ?? "Author detail";
  const citationCount = author?.citedByCount ?? papers.reduce((total, paper) => total + paper.citations, 0);
  const loading = authorQuery.loading && authorPapersQuery.loading && allPapersQuery.loading;
  const error = papers.length ? null : authorPapersQuery.error ?? allPapersQuery.error;

  if (loading) {
    return <AuthorDetailStatus title="Loading author..." description="Fetching author papers from the server." />;
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
              <span>Author</span>
            </div>
            <h1 className="paper-detail-title">{authorName}</h1>
            <p className="paper-detail-authors">
              {lastKnownInstitutions?.[0]?.display_name ?? "Institution data unavailable"}
              {author?.orcid ? <> · ORCID: {formatOrcid(author.orcid)}</> : null}
            </p>
          </div>
        </div>

        <div className="paper-detail-meta">
          <span><FileText />{(author?.worksCount ?? papers.length).toLocaleString()} works</span>
          <span><Quote />{citationCount.toLocaleString()} total citations</span>
          <span><BarChart3 />h-index {formatValue(author?.hIndex)}</span>
          <span><BookOpen />i10-index {formatValue(author?.i10Index)}</span>
        </div>

        <section className="author-detail-kpis">
          <MetricCard label="Works" value={author?.worksCount ?? papers.length} />
          <MetricCard label="Citations" value={citationCount} />
          <MetricCard label="2y mean citedness" value={author?.twoYearMeanCitedness ?? "N/A"} />
          <MetricCard label="Known papers here" value={papers.length} />
        </section>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><Building2 /> Affiliations</h2>
            <AffiliationList affiliations={affiliations ?? []} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><Sparkles /> Research topics</h2>
            <TopicList topics={topics} />
          </section>
        </div>

        <div className="author-detail-grid">
          <section className="paper-detail-section author-detail-panel">
            <h2><GraduationCap /> Concepts</h2>
            <ConceptList concepts={concepts} />
          </section>

          <section className="paper-detail-section author-detail-panel">
            <h2><BarChart3 /> Works by year</h2>
            <YearBars counts={countsByYear} />
          </section>
        </div>
      </article>

      {authorQuery.error && !author ? (
        <div className="paper-search-empty"><h2>Unable to load author profile</h2><p>{authorQuery.error}</p></div>
      ) : null}

      <section className="paper-detail-section">
        <h2>Papers by this author</h2>
        <p>{papers.length.toLocaleString()} related paper{papers.length === 1 ? "" : "s"} found for this author.</p>
      </section>

      <RelatedPapers
        emptyLabel="No papers were found for this author."
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

function AffiliationList({ affiliations }: { affiliations: AuthorAffiliation[] }) {
  const visibleAffiliations = affiliations.slice(0, 6);

  if (!visibleAffiliations.length) {
    return <p>Affiliation data unavailable.</p>;
  }

  return (
    <div className="author-detail-list">
      {visibleAffiliations.map((affiliation, index) => {
        const institution = affiliation.institution;
        const years = [...(affiliation.years ?? [])].sort((first, second) => second - first);

        return (
          <div className="author-detail-list-item" key={`${institution?.id ?? institution?.display_name ?? "affiliation"}-${index}`}>
            <div>
              <strong>{institution?.display_name ?? "Unknown institution"}</strong>
              <span>{[institution?.type, institution?.country_code].filter(Boolean).join(" · ") || "Institution"}</span>
            </div>
            <em>{formatYearRange(years)}</em>
          </div>
        );
      })}
    </div>
  );
}

function TopicList({ topics }: { topics: AuthorTopic[] }) {
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
          <div className="author-detail-topic" key={topic.id ?? topic.display_name}>
            <div className="author-detail-topic-row">
              <strong>{topic.display_name ?? "Untitled topic"}</strong>
              <span>{count.toLocaleString()}</span>
            </div>
            <div className="author-detail-topic-meta">{topic.subfield?.display_name ?? topic.field?.display_name ?? topic.domain?.display_name}</div>
            <div className="author-detail-track">
              <span style={{ width: `${Math.max((count / maxCount) * 100, 6)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConceptList({ concepts }: { concepts: { display_name?: string; score?: number }[] }) {
  const visibleConcepts = concepts.slice(0, 6);

  if (!visibleConcepts.length) {
    return <p>Concept data unavailable.</p>;
  }

  return (
    <div className="author-detail-chip-list">
      {visibleConcepts.map((concept) => (
        <span key={concept.display_name}>
          {concept.display_name}
          {typeof concept.score === "number" ? ` ${(concept.score * 100).toFixed(0)}%` : ""}
        </span>
      ))}
    </div>
  );
}

function YearBars({ counts }: { counts: AuthorYearCount[] }) {
  const visibleCounts = counts.filter((count) => count.year).slice(-12);
  const maxWorks = Math.max(...visibleCounts.map((count) => count.works_count ?? 0), 1);

  if (!visibleCounts.length) {
    return <p>Yearly activity data unavailable.</p>;
  }

  return (
    <div className="author-detail-year-bars">
      {visibleCounts.map((count) => {
        const works = count.works_count ?? 0;

        return (
          <div className="author-detail-year-bar" key={count.year}>
            <span>{works}</span>
            <div><i style={{ height: `${Math.max((works / maxWorks) * 100, 8)}%` }} /></div>
            <em>{count.year}</em>
          </div>
        );
      })}
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

function hasAuthor(paper: PaperApiModel, authorId: string) {
  return (paper.paperAuthorResponseModels ?? paper.paperAuthors ?? [])
    .some((author) => getAuthorId(author) === authorId);
}

function findAuthorName(papers: PaperApiModel[], authorId: string) {
  for (const paper of papers) {
    const author = (paper.paperAuthorResponseModels ?? paper.paperAuthors ?? [])
      .find((item) => getAuthorId(item) === authorId);
    const name = author ? getAuthorName(author) : undefined;

    if (name) return name;
  }

  return undefined;
}

function getAuthorId(author: PaperAuthor) {
  return author.authorId ?? author.author?.authorId ?? author.id ?? author.author?.id;
}

function getAuthorName(author: PaperAuthor) {
  return (
    author.author?.displayName ??
    author.author?.fullName ??
    author.rawAuthorName ??
    author.name ??
    author.authorName
  );
}

function getOpenAlexData(author: AuthorDetail | null): AuthorSourceSpecificData {
  const mapping = author?.authorSourceMappings?.[0];
  return parseObject<AuthorSourceSpecificData>(mapping?.sourceSpecificData) ?? {};
}

function parseList<T>(value: unknown): T[] | undefined {
  if (Array.isArray(value)) return value as T[];
  return parseObject<T[]>(value);
}

function parseObject<T>(value: unknown): T | undefined {
  if (!value) return undefined;
  if (typeof value === "object") return value as T;
  if (typeof value !== "string") return undefined;

  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function formatValue(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "N/A";
}

function formatOrcid(orcid: string) {
  return orcid.replace(/^https?:\/\/orcid\.org\//i, "");
}

function formatYearRange(years: number[]) {
  if (!years.length) return "N/A";
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(max) : `${min}-${max}`;
}

function AuthorDetailStatus({ title, description }: { title: string; description: string }) {
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
