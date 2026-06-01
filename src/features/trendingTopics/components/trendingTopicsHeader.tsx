import type { TrendingTimeRange } from "@/types/topics";

export function TrendingTopicsHeader({
  range,
  onRangeChange,
}: {
  range: TrendingTimeRange;
  onRangeChange: (range: TrendingTimeRange) => void;
}) {
  return (
    <div className="trending-topics-header">
      <div>
        <h1 className="trending-topics-title">Trending Topics</h1>
        <p className="trending-topics-description">
          Research areas ranked by publication momentum and community activity.
        </p>
      </div>
      <select
        value={range}
        onChange={(event) => onRangeChange(event.target.value as TrendingTimeRange)}
        className="trending-topics-select"
        aria-label="Trending topics time range"
      >
        <option value="7-days">Last 7 days</option>
        <option value="30-days">Last 30 days</option>
        <option value="6-months">Last 6 months</option>
      </select>
    </div>
  );
}
