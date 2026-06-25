"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useAdminUI } from "./AdminUI";

export function IndexScanButton({ hasData }: { hasData: boolean }) {
  const router = useRouter();
  const { toast } = useAdminUI();
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/admin/indexing?action=scan", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Scan failed (${res.status})`);
      toast.success("Index scan complete.");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setTimeout(() => setRunning(false), 600);
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
      {running ? "Scanning…" : hasData ? "Run Scan" : "Run first scan"}
    </button>
  );
}
