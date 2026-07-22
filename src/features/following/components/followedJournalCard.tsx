import { BookOpen, Star, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import type { FollowedJournal } from "@/types/library";

export function FollowedJournalCard({
  journal,
  onOpen,
  onToggleAlert,
  onRemove,
}: {
  journal: FollowedJournal;
  onOpen: (id: string | number) => void;
  onToggleAlert: (id: string | number) => void;
  onRemove: (id: string | number) => void;
}) {
  return (
    <article
      className="following-card following-card-clickable"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(journal.apiId ?? journal.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(journal.apiId ?? journal.id);
        }
      }}
    >
      <div className="following-card-heading">
        <div>
          <h2 className="following-card-title">{journal.name}</h2>
          <p className="following-card-subtitle">{journal.publisher}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Unfollow ${journal.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onRemove(journal.apiId ?? journal.id);
          }}
        >
          <X />
        </Button>
      </div>
      <div className="following-card-stats">
        <span><BookOpen />{journal.papers?.toLocaleString() ?? "Followed"} journal</span>
        <span className="text-amber-600">
          <Star />
          {journal.followedAt ? `Followed ${formatFollowedDate(journal.followedAt)}` : "Journal updates"}
        </span>
      </div>
      <div className="following-alert">
        <div><p>Journal updates</p><span>Notify me about new publications</span></div>
        <Switch
          checked={journal.alertOn}
          onClick={(event) => event.stopPropagation()}
          onCheckedChange={() => onToggleAlert(journal.id)}
        />
      </div>
    </article>
  );
}

function formatFollowedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
