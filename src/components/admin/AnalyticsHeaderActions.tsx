"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { MiniDropdown } from "./MiniDropdown";

const RANGES = [
  { value: "7", label: "Last 7 Days" },
  { value: "30", label: "Last 30 Days" },
  { value: "90", label: "Last 90 Days" },
];

export function AnalyticsHeaderActions({ range }: { range: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [clearing, setClearing] = useState(false);

  const changeRange = (v: string) => {
    startTransition(() => {
      router.push(`/admin/analytics?range=${v}`);
    });
  };

  const clearCache = async () => {
    setClearing(true);
    try {
      await fetch("/api/admin/analytics/refresh", { method: "POST" });
    } catch {
      /* ignore — refresh below still re-pulls */
    } finally {
      router.refresh();
      // brief spinner so the action feels acknowledged
      setTimeout(() => setClearing(false), 600);
    }
  };

  return (
    <div className="an-actions">
      <button
        type="button"
        className="an-btn-clear"
        onClick={clearCache}
        disabled={clearing}
      >
        <RefreshCw size={15} className={clearing ? "an-spin" : ""} />
        {clearing ? "Clearing…" : "Clear Cache"}
      </button>
      <div className={pending ? "an-dd-wrap is-pending" : "an-dd-wrap"}>
        <MiniDropdown
          value={String(range)}
          options={RANGES}
          onChange={changeRange}
          ariaLabel="Date range"
        />
      </div>
    </div>
  );
}
