import {
  Bookmark,
  BookOpen,
  ExternalLink,
  Quote,
} from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { PaperApiModel, PaperAuthor, PaperKeyword } from "@/types/papers";
import type { PaperSearchPaper } from "@/types/search";

type PaperResultCardPaper = PaperSearchPaper | PaperApiModel;

export function PaperResultCard({
  bookmarked = false,
  paper,
  onToggleBookmark,
}: {
  bookmarked?: boolean;
  paper: PaperResultCardPaper;
  onToggleBookmark: (id: string) => void;
}) {
  const paperId = getPaperId(paper);
  const tags = getPaperKeywords(paper).slice(0, 6);

  return (
    <article className="paper-result-card">
      <div className="paper-result-heading">
        <div className="min-w-0 flex-1">
          <div className="paper-result-badges">
            {isOpenAccess(paper) ? <Badge variant="success">Open Access</Badge> : <Badge variant="muted">Paper</Badge>}
            <span>{getPaperYear(paper)}</span>
          </div>
          <Link href={`/dashboard/papers/${paperId}`}>
            <h2 className="paper-result-title">{stripHtmlTags(paper.title)}</h2>
          </Link>
          <p className="paper-result-authors">{getPaperAuthors(paper).join(", ")}</p>
        </div>
        <Button
          type="button"
          variant={bookmarked ? "soft" : "ghost"}
          size="icon-sm"
          onClick={() => onToggleBookmark(paperId)}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"}
        >
          <Bookmark className={bookmarked ? "fill-current" : undefined} />
        </Button>
      </div>

      <div className="paper-result-tags">
        {tags.map((tag) => (
          <Tag key={tag} className="h-5 px-2 text-[10px]">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="paper-result-footer">
        <div className="paper-result-meta">
          <span>
            <BookOpen />
            {getJournalName(paper)}
          </span>
          <span>
            <Quote />
            {getCitationCount(paper).toLocaleString()} citations
          </span>
        </div>
        <Link href={`/dashboard/papers/${paperId}`} className="paper-result-link">
          View details <ExternalLink />
        </Link>
      </div>
    </article>
  );
}

function getPaperId(paper: PaperResultCardPaper) {
  return paper.paperId || ("id" in paper ? paper.id : "");
}

function getPaperAuthors(paper: PaperResultCardPaper): string[] {
  if ("authors" in paper && Array.isArray(paper.authors)) {
    return paper.authors.length ? paper.authors : ["Author information unavailable"];
  }

  const authors = [...("paperAuthorResponseModels" in paper || "paperAuthors" in paper ? paper.paperAuthorResponseModels ?? paper.paperAuthors ?? [] : [])]
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

function getPaperKeywords(paper: PaperResultCardPaper): string[] {
  if ("keywords" in paper && Array.isArray(paper.keywords)) {
    return paper.keywords;
  }

  return ("paperKeywords" in paper ? paper.paperKeywords ?? [] : [])
    .map(getKeywordName)
    .filter((keyword): keyword is string => Boolean(keyword));
}

function getKeywordName(keyword: PaperKeyword) {
  return keyword.keyword?.keywordName ?? keyword.keyword?.normalizedName ?? keyword.keywordName;
}

function getPaperYear(paper: PaperResultCardPaper) {
  return paper.publicationYear || "N/A";
}

function getCitationCount(paper: PaperResultCardPaper) {
  return paper.citedByCount ?? 0;
}

function getJournalName(paper: PaperResultCardPaper) {
  if ("journal" in paper) {
    return paper.journal?.journalName ?? paper.journal?.name ?? paper.journal?.title ?? "Journal information unavailable";
  }

  return "Journal information unavailable";
}

function isOpenAccess(paper: PaperResultCardPaper) {
  return "isOpenAccess" in paper ? paper.isOpenAccess : false;
}

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}