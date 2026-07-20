import type { TrendingTimeRange } from "@/types/topics";

export function TopicInsightHeader({
  range,
  onRangeChange,
}: {
  range: TrendingTimeRange;
  onRangeChange?: (range: TrendingTimeRange) => void;
}) {
  return (
    <div className="trending-topics-header">
      <div>
        <h1 className="trending-topics-title">Topic Insight</h1>
        <p className="trending-topics-description">
          Research areas ranked by publication momentum, growth signals, and searchable topic coverage.
        </p>
      </div>
      {onRangeChange ? (
        <select
          value={range}
          onChange={(event) => onRangeChange(event.target.value as TrendingTimeRange)}
          className="trending-topics-select"
          aria-label="Trending topics time range"
        >
          <option value="7-days">Last 7 days</option>
          <option value="30-days">Last 30 days</option>
          <option value="6-months">Last 6 months</option>
          <option value="20-years">Last 20 years</option>
        </select>
      ) : (
        <span className="trending-topics-range-pill">Last 20 years</span>
      )}
    </div>
  );
}
