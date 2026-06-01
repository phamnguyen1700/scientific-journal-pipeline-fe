import { BookOpen, ExternalLink, Quote, Trash2 } from "lucide-react";
import Link from "next/link";

import { Tag } from "@/components/common";
import { Button } from "@/shared/ui/button";
import type { SavedPaper } from "@/types/library";

export function BookmarkedPaperCard({
  paper,
  onRemove,
}: {
  paper: SavedPaper;
  onRemove: (id: number) => void;
}) {
  return (
    <article className="saved-paper-card">
      <div className="saved-paper-heading">
        <div className="min-w-0">
          <Link href={`/dashboard/papers/${paper.id}`}>
            <h2 className="saved-paper-title">{paper.title}</h2>
          </Link>
          <p className="saved-paper-authors">{paper.authors}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${paper.title}`}
          onClick={() => onRemove(paper.id)}
        >
          <Trash2 />
        </Button>
      </div>
      <p className="saved-paper-abstract">{paper.abstract}</p>
      <div className="saved-paper-tags">
        {paper.tags.map((tag) => (
          <Tag key={tag} className="h-5 px-2 text-[10px]">
            {tag}
          </Tag>
        ))}
      </div>
      <div className="saved-paper-footer">
        <div className="saved-paper-meta">
          <span><BookOpen />{paper.journal}</span>
          <span>{paper.year}</span>
          <span><Quote />{paper.citations} citations</span>
          <span>Saved {paper.savedAt}</span>
        </div>
        <Link href={`/dashboard/papers/${paper.id}`} className="library-action-link">
          Quick preview <ExternalLink />
        </Link>
      </div>
    </article>
  );
}
