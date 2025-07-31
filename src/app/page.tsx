'use client';

import { useEffect, useState } from "react";

type DeviceStatus = {
  status: string;
  timestamp: string;
};

export default function HomePage() {
  const [data, setData] = useState<DeviceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/device-status", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Connection Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Connection Status</h1>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Timestamp:</strong> {data.timestamp}</p>
    </main>
  );
}
