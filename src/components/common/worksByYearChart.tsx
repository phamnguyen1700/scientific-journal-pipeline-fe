export type WorksByYearChartItem = {
  year?: number | null;
  worksCount?: number | null;
};

export function WorksByYearChart({
  emptyLabel = "Yearly activity data unavailable.",
  items,
  years = 10,
}: {
  emptyLabel?: string;
  items: WorksByYearChartItem[];
  years?: number;
}) {
  const currentYear = new Date().getFullYear();
  const firstVisibleYear = currentYear - years + 1;
  const visibleItems = items
    .filter(
      (item) =>
        item.year &&
        item.year >= firstVisibleYear &&
        item.year <= currentYear,
    )
    .sort((first, second) => (first.year ?? 0) - (second.year ?? 0))
    .slice(-years);
  const maxWorks = Math.max(
    ...visibleItems.map((item) => item.worksCount ?? 0),
    1,
  );

  if (!visibleItems.length) {
    return <p>{emptyLabel}</p>;
  }

  return (
    <div className="author-detail-year-bars">
      {visibleItems.map((item) => {
        const works = item.worksCount ?? 0;

        return (
          <div className="author-detail-year-bar" key={item.year}>
            <span>{works.toLocaleString()}</span>
            <div>
              <i
                style={{ height: `${Math.max((works / maxWorks) * 100, 8)}%` }}
              />
            </div>
            <em
              className="author-detail-year-label"
              style={{
                transform: "translateX(-65%) rotate(-45deg)",
                transformOrigin: "top center",
              }}
            >
              {item.year}
            </em>
          </div>
        );
      })}
    </div>
  );
}