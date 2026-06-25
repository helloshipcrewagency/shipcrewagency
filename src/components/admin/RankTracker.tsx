"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Plus,
  Play,
  Trash2,
  TrendingUp,
  Target,
  Crosshair,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
} from "lucide-react";
import { useAdminUI } from "./AdminUI";
import type { Keyword } from "@/lib/rank/store";

function band(pos: number | null): string {
  if (pos === null) return "na";
  if (pos <= 3) return "top3";
  if (pos <= 10) return "top10";
  if (pos <= 30) return "mid";
  if (pos <= 50) return "low";
  return "deep";
}

export function RankTracker() {
  const { toast, confirm } = useAdminUI();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [provider, setProvider] = useState(false);
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [newKw, setNewKw] = useState("");
  const [newVol, setNewVol] = useState("");
  const [adding, setAdding] = useState(false);

  const apply = (d: {
    keywords?: Keyword[];
    provider?: boolean;
    domain?: string;
  }) => {
    if (Array.isArray(d.keywords)) setKeywords(d.keywords);
    if (typeof d.provider === "boolean") setProvider(d.provider);
    if (typeof d.domain === "string") setDomain(d.domain);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rank-tracker", { cache: "no-store" });
      apply(await res.json());
    } catch {
      toast.error("Could not load keywords.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    const kw = newKw.trim();
    if (!kw) return;
    setAdding(true);
    try {
      const res = await fetch("/api/admin/rank-tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw, volume: Number(newVol) || null }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      apply(d);
      setNewKw("");
      setNewVol("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const remove = async (k: Keyword) => {
    const ok = await confirm({
      title: "Remove keyword?",
      message: `Stop tracking “${k.keyword}”.`,
      confirmLabel: "Remove",
      tone: "danger",
    });
    if (!ok) return;
    const res = await fetch(`/api/admin/rank-tracker?id=${k.id}`, {
      method: "DELETE",
    });
    if (res.ok) apply(await res.json());
  };

  const runCheck = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/rank-tracker?action=check", {
        method: "POST",
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Check failed");
      apply(d);
      toast.success("Rankings updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Check failed");
    } finally {
      setRunning(false);
    }
  };

  const stats = useMemo(() => {
    const ranked = keywords.filter((k) => k.position !== null);
    const top10 = keywords.filter(
      (k) => k.position !== null && k.position <= 10,
    ).length;
    const avg = ranked.length
      ? (
          ranked.reduce((s, k) => s + (k.position ?? 0), 0) / ranked.length
        ).toFixed(1)
      : "—";
    return { tracked: keywords.length, top10, avg, found: ranked.length };
  }, [keywords]);

  return (
    <div>
      <div className="a-page-head">
        <div>
          <h1 className="a-page-head__title">
            <Trophy size={20} style={{ verticalAlign: "-3px", marginRight: 8, color: "var(--a-cyan-500)" }} />
            Rank Tracker
          </h1>
          <p className="a-page-head__sub">
            Track your Google rankings for target keywords ({domain || "your site"}).
          </p>
        </div>
        <div className="a-page-head__actions">
          <button
            type="button"
            className="a-btn a-btn--primary"
            onClick={runCheck}
            disabled={running || keywords.length === 0}
          >
            {running ? (
              <span className="a-spin" style={{ width: 15, height: 15 }} />
            ) : (
              <Play size={15} />
            )}
            Run Check
          </button>
        </div>
      </div>

      {!provider && (
        <div className="an-error" style={{ background: "rgba(217,138,26,0.08)", borderColor: "rgba(217,138,26,0.3)", color: "var(--a-warning)" }}>
          <Target size={16} />
          <div>
            Add a rank API key to fetch real Google positions. Set{" "}
            <code>SERPAPI_KEY</code> in your hosting environment (SerpApi) and
            redeploy — “Run Check” will then fill in positions. You can add and
            organise keywords now.
          </div>
        </div>
      )}

      <div className="rt-stats">
        <Stat icon={<Crosshair size={18} />} label="Keywords tracked" value={stats.tracked} />
        <Stat icon={<Trophy size={18} />} label="In top 10" value={stats.top10} />
        <Stat icon={<TrendingUp size={18} />} label="Avg position" value={stats.avg} />
        <Stat icon={<Activity size={18} />} label="Found in top 100" value={stats.found} />
      </div>

      <div className="a-card rt-add">
        <input
          className="a-input"
          placeholder="Add a keyword to track…"
          value={newKw}
          onChange={(e) => setNewKw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <input
          className="a-input rt-add__vol"
          placeholder="Volume (optional)"
          value={newVol}
          onChange={(e) => setNewVol(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <button
          type="button"
          className="a-btn a-btn--cyan"
          onClick={add}
          disabled={adding || !newKw.trim()}
        >
          <Plus size={15} /> Add Keyword
        </button>
      </div>

      <div className="a-card">
        {loading ? (
          <div className="a-loading">
            <span className="a-spin" /> Loading…
          </div>
        ) : keywords.length === 0 ? (
          <div className="a-empty">
            <div className="a-empty__title">No keywords yet</div>
            <div className="a-empty__text">
              Add the keywords you want to rank for and press Run Check.
            </div>
          </div>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table rt-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Keyword</th>
                  <th className="a-th-right">Volume</th>
                  <th className="a-th-right">Position</th>
                  <th className="a-th-right">Change</th>
                  <th>Ranking URL</th>
                  <th className="a-th-right">Checked</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {keywords.map((k, i) => {
                  const delta =
                    k.position !== null && k.prevPosition !== null
                      ? k.prevPosition - k.position
                      : null;
                  return (
                    <tr key={k.id}>
                      <td className="a-muted">{i + 1}</td>
                      <td className="a-table__title">{k.keyword}</td>
                      <td className="a-th-right a-muted">
                        {k.volume ? k.volume.toLocaleString("en-US") : "—"}
                      </td>
                      <td className="a-th-right">
                        <span className={`rt-pos rt-pos--${band(k.position)}`}>
                          {k.position === null ? "N/A" : `#${k.position}`}
                        </span>
                      </td>
                      <td className="a-th-right">
                        {delta === null || delta === 0 ? (
                          <span className="rt-change rt-change--flat">
                            <Minus size={13} /> 0
                          </span>
                        ) : delta > 0 ? (
                          <span className="rt-change rt-change--up">
                            <ArrowUp size={13} /> {delta}
                          </span>
                        ) : (
                          <span className="rt-change rt-change--down">
                            <ArrowDown size={13} /> {Math.abs(delta)}
                          </span>
                        )}
                      </td>
                      <td>
                        {k.url ? (
                          <a
                            href={k.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rt-url"
                          >
                            {new URL(k.url).pathname || "/"} <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span className="a-muted">—</span>
                        )}
                      </td>
                      <td className="a-th-right a-muted">
                        {k.checkedAt
                          ? new Date(k.checkedAt).toLocaleDateString("en-US")
                          : "—"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="a-iconbtn a-iconbtn--danger"
                          onClick={() => remove(k)}
                          title="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rt-legend">
        <span><span className="rt-dot rt-dot--top3" /> Top 3</span>
        <span><span className="rt-dot rt-dot--top10" /> 4–10</span>
        <span><span className="rt-dot rt-dot--mid" /> 11–30</span>
        <span><span className="rt-dot rt-dot--low" /> 31–50</span>
        <span><span className="rt-dot rt-dot--deep" /> 50+</span>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rt-stat">
      <span className="rt-stat__icon">{icon}</span>
      <div>
        <div className="rt-stat__value">{value}</div>
        <div className="rt-stat__label">{label}</div>
      </div>
    </div>
  );
}
