"use client";

import { ArrowLeft, BookOpen, FileText, Quote } from "lucide-react";
import Link from "next/link";

import { PaperResultCard } from "@/features/paperSearch/components";
import { toPaperSearchResult } from "@/features/paperSearch/paperMapper";
import { usePapers, usePapersByAuthor } from "@/hooks/papers";
import type { PaperApiModel, PaperAuthor } from "@/types/papers";

export function AuthorDetailPage({ id }: { id: string }) {
  const authorPapersQuery = usePapersByAuthor(id);
  const allPapersQuery = usePapers();
  const relatedRawPapers = mergePapers(
    authorPapersQuery.papers,
    allPapersQuery.papers.filter((paper) => hasAuthor(paper, id))
  );
  const papers = relatedRawPapers.map(toPaperSearchResult);
  const authorName = findAuthorName(relatedRawPapers, id) ?? "Author detail";
  const citationCount = papers.reduce((total, paper) => total + paper.citations, 0);
  const loading = authorPapersQuery.loading && allPapersQuery.loading;
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
            <p className="paper-detail-authors">Author ID: {id}</p>
          </div>
        </div>

        <div className="paper-detail-meta">
          <span><FileText />{papers.length.toLocaleString()} related papers</span>
          <span><Quote />{citationCount.toLocaleString()} total citations</span>
          <span><BookOpen />Scientific journal pipeline</span>
        </div>

        <section className="paper-detail-section">
          <h2>Papers by this author</h2>
          <p>{papers.length.toLocaleString()} related paper{papers.length === 1 ? "" : "s"} found for this author.</p>
        </section>
      </article>

      <RelatedPapers
        emptyLabel="No papers were found for this author."
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
