"use client";

import { useEffect, useState } from "react";

interface SensorData {
  status: "Connected" | "Disconnected";
  time: string;
  ph: string;
  turbidity: string;
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/send-sensor-data", { cache: "no-store" });
        const data = await res.json();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setSensorData(null);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Device Status: {sensorData?.status === "Connected" ? "✅ Connected" : "❌ Disconnected"}</h1>
      <h2>🕒 Time: {sensorData?.time ?? "Loading..."}</h2>
      <h2>💧 Turbidity: {sensorData?.turbidity ?? "Loading..."} NTU</h2>
      <h2>🧪 pH Level: {sensorData?.ph ?? "Loading..."}</h2>
    </main>
  );
}
