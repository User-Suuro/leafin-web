'use client';

import { useEffect, useState } from "react";

type DeviceStatus = { status: "online" | "offline"; timestamp: string | null };

export default function HomePage() {
  const [data, setData]   = useState<DeviceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // poll once a second; adjust if you like
    const id = setInterval(() => {
      fetch("/api/device-status", { cache: "no-store" })
        .then(r => r.ok ? r.json() : Promise.reject(`${r.status}`))
        .then(setData)
        .catch(e => setError(String(e)));
    }, 1_000);

    return () => clearInterval(id);
  }, []);

  if (error)       return <p>Error: {error}</p>;
  if (!data)       return <p>Loading…</p>;

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Connection Status</h1>
      <p>
        <strong>Status:</strong>{" "}
        {data.status === "online" ? "✅ Connected" : "❌ Offline"}
      </p>
      <p>
        <strong>Last heartbeat:</strong>{" "}
        {data.timestamp ?? "never"}
      </p>
    </main>
  );
}
