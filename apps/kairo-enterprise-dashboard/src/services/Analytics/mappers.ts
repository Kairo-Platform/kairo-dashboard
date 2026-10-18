import type { AnalyticsPoint, DashboardAnalytics } from "./types";

export function metricValue(value: number | null | undefined): string {
  return value == null
    ? "N/A"
    : value.toLocaleString("en-NG", { maximumFractionDigits: 2 });
}

export function chartPoints(
  points: AnalyticsPoint[] | undefined,
  analytics: DashboardAnalytics | null,
) {
  if (!analytics) return [];
  const formatter = new Intl.DateTimeFormat("en-NG", {
    timeZone: analytics.timezone,
    ...(analytics.interval === "hour"
      ? ({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" } as const)
      : ({ month: "short", day: "numeric" } as const)),
  });
  return (points ?? []).map((point) => ({
    label: formatter.format(new Date(point.timestamp)),
    value: point.value,
  }));
}
