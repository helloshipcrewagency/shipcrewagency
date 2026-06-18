"use client";

import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { MiniDropdown } from "./MiniDropdown";
import type { DailyClick, DailyPoint } from "@/lib/analytics/data";

const MON = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
function parse(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return { y, m, day };
}
function longLabel(d: string) {
  const p = parse(d);
  return p.m ? `${MON[p.m - 1]} ${p.day}` : d;
}
function shortLabel(d: string) {
  const p = parse(d);
  return p.m ? `${p.m}/${p.day}` : d;
}

type Mode = "users" | "clicks" | "both";

export function AnalyticsChart({
  daily,
  dailyClicks,
  rangeDays,
}: {
  daily: DailyPoint[];
  dailyClicks: DailyClick[];
  rangeDays: number;
}) {
  const hasClicks = dailyClicks.length > 0;
  const [mode, setMode] = useState<Mode>("users");

  // Merge users + clicks into one date-sorted series.
  const points = useMemo(() => {
    const map = new Map<string, { date: string; users: number; clicks: number }>();
    for (const d of daily)
      map.set(d.date, { date: d.date, users: d.users, clicks: 0 });
    for (const c of dailyClicks) {
      const e = map.get(c.date) ?? { date: c.date, users: 0, clicks: 0 };
      e.clicks = c.clicks;
      map.set(c.date, e);
    }
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [daily, dailyClicks]);

  const maxUsers = Math.max(1, ...points.map((p) => p.users));
  const maxClicks = Math.max(1, ...points.map((p) => p.clicks));

  const options = [
    { value: "users", label: "Daily Active Users" },
    ...(hasClicks
      ? [
          { value: "clicks", label: "Daily Search Clicks" },
          { value: "both", label: "Clicks vs Users" },
        ]
      : []),
  ];

  const source =
    mode === "users"
      ? "Google Analytics"
      : mode === "clicks"
        ? "Search Console"
        : "Analytics + Search Console";

  const title =
    mode === "users"
      ? "Daily Active Users"
      : mode === "clicks"
        ? "Daily Search Clicks"
        : "Clicks vs Users";

  const empty =
    mode === "clicks" || mode === "both"
      ? !hasClicks && points.every((p) => p.users === 0)
      : points.every((p) => p.users === 0);

  const pct = (v: number, max: number) =>
    v > 0 ? `${Math.max(3, Math.round((v / max) * 100))}%` : "0%";

  return (
    <div className="a-card an-chart">
      <div className="an-chart__head">
        <h2 className="an-chart__title">
          <BarChart3 size={17} />
          {title} — Last {rangeDays} Days
        </h2>
        <div className="an-chart__tools">
          <MiniDropdown
            value={mode}
            options={options}
            onChange={(v) => setMode(v as Mode)}
            ariaLabel="Chart metric"
          />
          <span className="an-chart__src">from {source}</span>
        </div>
      </div>

      {mode === "both" && (
        <div className="an-legend">
          <span className="an-legend__item">
            <span className="an-dot an-dot--u" /> Users
          </span>
          <span className="an-legend__item">
            <span className="an-dot an-dot--c" /> Clicks
          </span>
        </div>
      )}

      {points.length === 0 || empty ? (
        <div className="an-nodata">No data for this period yet.</div>
      ) : (
        <>
          <div className="an-bars">
            {points.map((p) =>
              mode === "both" ? (
                <div className="an-bar an-bar--dual" key={p.date}>
                  <span className="an-bar__tip">
                    {p.users} users · {p.clicks} clicks · {shortLabel(p.date)}
                  </span>
                  <span
                    className="an-bar__fill an-bar__fill--u"
                    style={{ height: pct(p.users, maxUsers) }}
                  />
                  <span
                    className="an-bar__fill an-bar__fill--c"
                    style={{ height: pct(p.clicks, maxClicks) }}
                  />
                </div>
              ) : (
                <div className="an-bar" key={p.date}>
                  <span className="an-bar__tip">
                    {mode === "users" ? p.users : p.clicks} {shortLabel(p.date)}
                  </span>
                  <span
                    className={`an-bar__fill ${mode === "users" ? "an-bar__fill--u" : "an-bar__fill--c"}`}
                    style={{
                      height:
                        mode === "users"
                          ? pct(p.users, maxUsers)
                          : pct(p.clicks, maxClicks),
                    }}
                  />
                </div>
              ),
            )}
          </div>
          <div className="an-axis">
            <span>{longLabel(points[0].date)}</span>
            <span>{longLabel(points[points.length - 1].date)}</span>
          </div>
        </>
      )}
    </div>
  );
}
