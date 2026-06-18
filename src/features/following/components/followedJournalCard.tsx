import { BookOpen, Star, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import type { FollowedJournal } from "@/types/library";

export function FollowedJournalCard({ journal, onToggleAlert, onRemove }: { journal: FollowedJournal; onToggleAlert: (id: string | number) => void; onRemove: (id: string | number) => void }) {
  return (
    <article className="following-card">
      <div className="following-card-heading">
        <div>
          <h2 className="following-card-title">{journal.name}</h2>
          <p className="following-card-subtitle">{journal.publisher}</p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`Unfollow ${journal.name}`} onClick={() => onRemove(journal.id)}><X /></Button>
      </div>
      <div className="following-card-stats">
        <span><BookOpen />{journal.papers.toLocaleString()} papers</span>
        <span className="text-amber-600"><Star />Impact factor {journal.impactFactor}</span>
      </div>
      <div className="following-alert">
        <div><p>Journal updates</p><span>Notify me about new publications</span></div>
        <Switch checked={journal.alertOn} onCheckedChange={() => onToggleAlert(journal.id)} />
      </div>
    </article>
  );
}
