import { BookOpen, ExternalLink, Quote, Trash2 } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { Button } from "@/shared/ui/button";
import type { PaperApiModel, PaperAuthor, PaperKeyword } from "@/types/papers";
import type { UserBookmark } from "@/types/user";

type BookmarkPaper = PaperApiModel | UserBookmark["paper"];

export function BookmarkedPaperCard({
  bookmark,
  paper,
  onRemove,
}: {
  bookmark: UserBookmark;
  paper: BookmarkPaper;
  onRemove: () => void;
}) {
  const title = paper?.title ?? "Paper information unavailable";
  const authors = getPaperAuthors(paper).join(", ");
  const journal = getJournalName(paper);
  const tags = getPaperTags(paper).slice(0, 6);

  return (
    <article className="saved-paper-card">
      <div className="saved-paper-heading">
        <div className="min-w-0">
          <Link href={`/dashboard/papers/${bookmark.paperId}`}>
            <h2 className="saved-paper-title">{title}</h2>
          </Link>
          <p className="saved-paper-authors">{authors}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${title}`}
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
      <p className="saved-paper-abstract">{paper?.abstract ?? "No abstract is available for this paper."}</p>
      <div className="saved-paper-tags">
        {tags.map((tag) => (
          <Tag key={tag} className="h-5 px-2 text-[10px]">
            {tag}
          </Tag>
        ))}
      </div>
      <div className="saved-paper-footer">
        <div className="saved-paper-meta">
          <span><BookOpen />{journal}</span>
          <span>{paper?.publicationYear ?? "N/A"}</span>
          <span><Quote />{getCitationCount(paper)} citations</span>
          <span>Saved {formatBookmarkDate(bookmark.createdAt)}</span>
        </div>
        <Link href={`/dashboard/papers/${bookmark.paperId}`} className="library-action-link">
          Quick preview <ExternalLink />
        </Link>
      </div>
    </article>
  );
}

function getPaperAuthors(paper: BookmarkPaper) {
  if (!paper) return ["Author information unavailable"];

  const authors = [
    ...("paperAuthorResponseModels" in paper ? paper.paperAuthorResponseModels ?? [] : []),
    ...(paper.paperAuthors ?? []),
  ]
    .sort((first, second) => (first.authorOrder ?? 0) - (second.authorOrder ?? 0))
    .map(getAuthorName)
    .filter((author): author is string => Boolean(author));

  return authors.length ? authors : ["Author information unavailable"];
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

function getJournalName(paper: BookmarkPaper) {
  if (paper && "journal" in paper) {
    return paper.journal?.journalName ?? paper.journal?.name ?? paper.journal?.title ?? "Journal information unavailable";
  }

  return "Journal information unavailable";
}

function getPaperTags(paper: BookmarkPaper) {
  if (!paper) return [];

  const keywords = (paper.paperKeywords ?? [])
    .map(getKeywordName)
    .filter((keyword): keyword is string => Boolean(keyword));

  if (isFullPaper(paper)) {
    return [...keywords, paper.paperType, paper.language].filter((tag): tag is string => Boolean(tag));
  }

  return keywords;
}

function isFullPaper(paper: BookmarkPaper): paper is PaperApiModel {
  return Boolean(paper && "paperType" in paper);
}

function getKeywordName(keyword: PaperKeyword) {
  return keyword.keyword?.keywordName ?? keyword.keyword?.normalizedName ?? keyword.keywordName;
}

function getCitationCount(paper: BookmarkPaper) {
  return paper && "citedByCount" in paper ? paper.citedByCount ?? 0 : 0;
}

function formatBookmarkDate(value: string | undefined) {
  if (!value) return "recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
