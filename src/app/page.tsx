"use client";

import { useEffect, useState } from "react";

interface SensorData {
  time: string;
  date: string;
  ph: string;
  turbidity: string;
  timestamp: number;
}

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<"Connected" | "Disconnected">("Disconnected");

  // Fetch sensor data every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/send-sensor-data", { cache: "no-store" });
        const json = await res.json();

        const now = Date.now();
        const elapsed = now - json.timestamp;

        if (elapsed < 10000) {
          setStatus("Connected");
        } else {
          setStatus("Disconnected");
        }

        setData(json);
      } catch (error) {
        console.error("Error fetching:", error);
        setStatus("Disconnected");
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>
        Device Status:{" "}
        {status === "Connected" ? "✅ Connected" : "❌ Disconnected"}
      </h1>
      <h2>🕒 Time: {data?.time ?? "Loading..."}</h2>
      <h2>📅 Date: {data?.date ?? "Loading..."}</h2>
      <h2>💧 Turbidity: {data?.turbidity ?? "Loading..."} NTU</h2>
      <h2>🧪 pH Level: {data?.ph ?? "Loading..."}</h2>
    </main>
  );
}
