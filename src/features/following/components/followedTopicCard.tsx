import { FileText, TrendingUp, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import type { FollowedTopic } from "@/types/library";

export function FollowedTopicCard({ topic, onToggleAlert, onRemove }: { topic: FollowedTopic; onToggleAlert: (id: number) => void; onRemove: (id: number) => void }) {
  return (
    <article className="following-card">
      <div className="following-card-heading">
        <div>
          <h2 className="following-card-title">{topic.name}</h2>
          <p className="following-card-subtitle">{topic.category}</p>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`Unfollow ${topic.name}`} onClick={() => onRemove(topic.id)}><X /></Button>
      </div>
      <div className="following-card-stats">
        <span><FileText />{topic.papers.toLocaleString()} papers</span>
        <span className="text-emerald-600"><TrendingUp />{topic.growth}% growth</span>
      </div>
      <div className="following-alert">
        <div><p>Research alerts</p><span>Notify me about new papers</span></div>
        <Switch checked={topic.alertOn} onCheckedChange={() => onToggleAlert(topic.id)} />
      </div>
    </article>
  );
}
