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
import type { PaperSearchResult } from "@/types/search";

export function PaperResultCard({
  paper,
  onToggleBookmark,
}: {
  paper: PaperSearchResult;
  onToggleBookmark: (id: string) => void;
}) {
  return (
    <article className="paper-result-card">
      <div className="paper-result-heading">
        <div className="min-w-0 flex-1">
          <div className="paper-result-badges">
            {paper.openAccess && <Badge variant="success">Open Access</Badge>}
            <span>{paper.year}</span>
          </div>
          <Link href={`/dashboard/papers/${paper.id}`}>
            <h2 className="paper-result-title">{paper.title}</h2>
          </Link>
          <p className="paper-result-authors">{paper.authors.join(", ")}</p>
        </div>
        <Button
          type="button"
          variant={paper.bookmarked ? "soft" : "ghost"}
          size="icon-sm"
          onClick={() => onToggleBookmark(paper.id)}
          aria-label={paper.bookmarked ? "Remove bookmark" : "Bookmark paper"}
        >
          <Bookmark className={paper.bookmarked ? "fill-current" : undefined} />
        </Button>
      </div>

      <div className="paper-result-tags">
        {paper.tags.map((tag) => (
          <Tag key={tag} className="h-5 px-2 text-[10px]">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="paper-result-footer">
        <div className="paper-result-meta">
          <span>
            <BookOpen />
            {paper.journal}
          </span>
          <span>
            <Quote />
            {paper.citations} citations
          </span>
        </div>
        <Link href={`/dashboard/papers/${paper.id}`} className="paper-result-link">
          View details <ExternalLink />
        </Link>
      </div>
    </article>
  );
}
