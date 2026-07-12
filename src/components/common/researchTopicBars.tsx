export type ResearchTopicBarItem = {
  id?: string | number | null;
  title: string;
  subtitle?: string | null;
  count?: number | null;
};

export function ResearchTopicBars({
  emptyLabel = "Topic data unavailable.",
  items,
  maxItems = 5,
}: {
  emptyLabel?: string;
  items: ResearchTopicBarItem[];
  maxItems?: number;
}) {
  const visibleItems = [...items]
    .filter((item) => item.title)
    .sort((first, second) => (second.count ?? 0) - (first.count ?? 0))
    .slice(0, maxItems);
  const maxCount = Math.max(
    ...visibleItems.map((item) => item.count ?? 0),
    1,
  );

  if (!visibleItems.length) {
    return <p>{emptyLabel}</p>;
  }

  return (
    <div className="author-detail-topic-list">
      {visibleItems.map((item) => {
        const count = item.count ?? 0;

        return (
          <div className="author-detail-topic" key={item.id ?? item.title}>
            <div className="author-detail-topic-row">
              <strong>{item.title}</strong>
            </div>
            {item.subtitle ? (
              <div className="author-detail-topic-meta">{item.subtitle}</div>
            ) : null}
            <div className="author-detail-track">
              <span
                style={{ width: `${Math.max((count / maxCount) * 100, 18)}%` }}
              >
                <strong>{count.toLocaleString()} works</strong>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}