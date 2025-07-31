// File: src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/device-status-check", { cache: "no-store" });
      const json = await res.json();
      setStatus(json.online ? "connected" : "disconnected");
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Device is: {status === "connected" ? "✅ Connected" : "❌ Disconnected"}</h1>
    </main>
  );
}
