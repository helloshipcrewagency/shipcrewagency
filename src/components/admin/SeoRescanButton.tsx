"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export function SeoRescanButton({ hasData }: { hasData: boolean }) {
  const router = useRouter();
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/seo-health", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      router.refresh();
    } catch {
      /* surfaced as no change */
    } finally {
      setTimeout(() => setRunning(false), 800);
    }
  };

  return (
    <button
      type="button"
      className="a-btn a-btn--primary"
      onClick={run}
      disabled={running}
    >
      <RefreshCw size={15} className={running ? "an-spin" : ""} />
      {running ? "Scanning…" : hasData ? "Re-scan" : "Run scan"}
    </button>
  );
}
