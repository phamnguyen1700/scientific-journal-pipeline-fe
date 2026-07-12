"use client";

import { useState } from "react";
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
import { AuthorDetailDrawer } from "@/features/authors";
import { JournalDetailDrawer } from "@/features/journals";
import { usePaper } from "@/hooks/papers";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type {
  PaperApiModel,
  PaperAuthor,
  PaperKeyword,
  PaperTopic,
} from "@/types/papers";
import { PaperDetailHeader } from "./components/paperDetailHeader";

export function PaperDetailPage({ id }: { id: string }) {
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null,
  );
  const paperQuery = usePaper(id);

  if (paperQuery.loading) {
    return (
      <PaperDetailStatus
        title="Loading paper..."
        description="Fetching paper details from the server."
      />
    );
  }

  if (paperQuery.error || !paperQuery.paper) {
    return (
      <PaperDetailStatus
        title="Paper not found"
        description={
          paperQuery.error ?? "The requested paper is not available."
        }
      />
    );
  }

  const paper = paperQuery.paper;
  const doi = normalizeDoi(paper.doi);
  const authorLinks = getAuthorLinks(paper);
  const journalId = paper.journalId;
  const topics = getPaperTopics(paper);
  const keywords = getPaperKeywords(paper);
  const sourceRecordId = paper.paperSourceMappings?.[0]?.sourceRecordId;

  return (
    <div className="paper-detail-page">
      <PaperDetailHeader />

      <Link href="/dashboard/papers" className="paper-detail-back">
        <ArrowLeft /> Back to paper search
      </Link>

      <article className="paper-detail-card">
        <div className="paper-detail-heading">
          <div>
            <div className="paper-result-badges">
              {paper.isOpenAccess && (
                <Badge variant="success">Open Access</Badge>
              )}
              {paper.isRetracted && <Badge variant="danger">Retracted</Badge>}
              {paper.paperType && (
                <Badge variant="muted">{paper.paperType}</Badge>
              )}
            </div>
            <h1 className="paper-detail-title">{paper.title}</h1>
            <p className="paper-detail-authors">
              {authorLinks.length
                ? authorLinks.map((author, index) => (
                    <span key={`${author.name}-${index}`}>
                      {index > 0 && ", "}
                      {author.id ? (
                        <button
                          type="button"
                          className="paper-detail-inline-link"
                          onClick={() => setSelectedAuthorId(author.id ?? null)}
                        >
                          {author.name}
                        </button>
                      ) : (
                        author.name
                      )}
                    </span>
                  ))
                : getPaperAuthorNames(paper).join(", ")}
            </p>
          </div>

          {doi && (
            <Button
              render={
                <a
                  href={`https://doi.org/${doi}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Open DOI <ExternalLink />
            </Button>
          )}
        </div>

        <div className="paper-detail-meta">
          <span>
            <BookOpen />
            {journalId ? (
              <button
                type="button"
                className="paper-detail-inline-link"
                onClick={() => setSelectedJournalId(journalId)}
              >
                {getJournalName(paper)}
              </button>
            ) : (
              getJournalName(paper)
            )}
          </span>
          <span>
            <CalendarDays />
            {paper.publicationDate ?? paper.publicationYear}
          </span>
          <span>
            <Quote />
            {paper.citedByCount.toLocaleString()} citations
          </span>
          <span>
            <FileText />
            {paper.referenceCount.toLocaleString()} references
          </span>
          {paper.language && (
            <span>
              <Languages />
              {paper.language.toUpperCase()}
            </span>
          )}
          {paper.volume && <span>Vol. {paper.volume}</span>}
          {paper.issue && <span>Issue {paper.issue}</span>}
          {paper.page && <span>Pages {paper.page}</span>}
        </div>

        <p className="paper-detail-doi">DOI: {doi ?? "Not available"}</p>
        {sourceRecordId && (
          <p className="paper-detail-doi">Source record: {sourceRecordId}</p>
        )}

        <section className="paper-detail-section">
          <h2>Abstract</h2>
          <p>{paper.abstract ?? "No abstract is available for this paper."}</p>
        </section>

        {topics.length > 0 && (
          <section className="paper-detail-section">
            <h2>Topics</h2>
            <div className="paper-result-tags">
              {topics.map((topic) =>
                topic.id ? (
                  <Link
                    key={topic.id}
                    href={`/dashboard/topics/${topic.id}`}
                    className="paper-detail-inline-link"
                  >
                    <Tag>{formatScoredLabel(topic.name, topic.score)}</Tag>
                  </Link>
                ) : (
                  <Tag key={topic.name}>
                    {formatScoredLabel(topic.name, topic.score)}
                  </Tag>
                ),
              )}
            </div>
          </section>
        )}

        {keywords.length > 0 && (
          <section className="paper-detail-section">
            <h2>Keywords</h2>
            <div className="paper-result-tags">
              {keywords.map((keyword) => (
                <Tag key={keyword.id ?? keyword.name}>
                  {formatScoredLabel(keyword.name, keyword.score)}
                </Tag>
              ))}
            </div>
          </section>
        )}
      </article>

      <AuthorDetailDrawer
        authorId={selectedAuthorId}
        open={Boolean(selectedAuthorId)}
        onOpenChange={(open) => {
          if (!open) setSelectedAuthorId(null);
        }}
      />
      <JournalDetailDrawer
        journalId={selectedJournalId}
        open={Boolean(selectedJournalId)}
        onOpenChange={(open) => {
          if (!open) setSelectedJournalId(null);
        }}
      />
    </div>
  );
}

function getJournalName(paper: PaperApiModel) {
  return (
    paper.journal?.journalName ??
    paper.journal?.name ??
    paper.journal?.title ??
    "Journal information unavailable"
  );
}

function getPaperAuthorNames(paper: PaperApiModel) {
  return getAuthorLinks(paper).map((author) => author.name);
}
function normalizeDoi(doi: string | null) {
  const value = doi?.trim();
  if (
    !value ||
    ["null", "undefined", "n/a", "na", "-"].includes(value.toLowerCase())
  ) {
    return null;
  }

  return value;
}

function getAuthorLinks(paper: PaperApiModel) {
  return [...(paper.paperAuthorResponseModels ?? paper.paperAuthors ?? [])]
    .sort(
      (first, second) => (first.authorOrder ?? 0) - (second.authorOrder ?? 0),
    )
    .map((author) => ({
      id: getAuthorId(author),
      name: getAuthorName(author) ?? "",
    }))
    .filter((author) => Boolean(author.name));
}

function getAuthorId(author: PaperAuthor) {
  return (
    author.authorId ?? author.author?.authorId ?? author.id ?? author.author?.id
  );
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

function getPaperTopics(paper: PaperApiModel) {
  return (paper.paperTopics ?? [])
    .map((paperTopic: PaperTopic) => ({
      id: paperTopic.topic?.topicId ?? paperTopic.topicId,
      name:
        paperTopic.topic?.topicName ??
        paperTopic.topic?.normalizedName ??
        paperTopic.topicName ??
        "",
      score: paperTopic.score ?? null,
    }))
    .filter((topic) => Boolean(topic.name));
}

function getPaperKeywords(paper: PaperApiModel) {
  return (paper.paperKeywords ?? [])
    .map((paperKeyword: PaperKeyword) => ({
      id: paperKeyword.keyword?.keywordId ?? paperKeyword.keywordId,
      name:
        paperKeyword.keyword?.keywordName ??
        paperKeyword.keyword?.normalizedName ??
        paperKeyword.keywordName ??
        "",
      score: paperKeyword.score ?? null,
    }))
    .filter((keyword) => Boolean(keyword.name))
    .sort((first, second) => (second.score ?? 0) - (first.score ?? 0));
}

function formatScoredLabel(name: string, score: number | null | undefined) {
  return typeof score === "number"
    ? `${name} (${(score * 100).toFixed(0)}%)`
    : name;
}

function PaperDetailStatus({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
