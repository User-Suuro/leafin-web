// File: src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
  const [weight, setWeight] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res1 = await fetch("/api/device-status-check", { cache: "no-store" });
        const json1 = await res1.json();
        setStatus(json1.online ? "connected" : "disconnected");

        const res2 = await fetch("/api/send-weight", { cache: "no-store" });
        const json2 = await res2.json();
        setWeight(json2.weight);
      } catch (error) {
        console.error("Error fetching status or weight", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Device is: {status === "connected" ? "✅ Connected" : "❌ Disconnected"}</h1>
      <h2>Weight: {weight !== null ? `${weight.toFixed(2)} g` : "Loading..."}</h2>
    </main>
  );
}
