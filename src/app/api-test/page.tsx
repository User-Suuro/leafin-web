"use client";

import { useEffect, useState } from "react";

interface SensorData {
  connected: boolean;
  time: string;
  date: string;
  ph: string;
  turbid: string;
  water_temp: string;
  tds: string;
  is_water_lvl_normal: boolean;
  web_time: number;
}

export default function ApiTest() {
  const [data, setData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<"Connected" | "Disconnected">("Disconnected");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/arduino/send-data", { cache: "no-store" });
        const json = await res.json();

        const now = Date.now();
        const elapsed = now - json.timestamp;

        if (elapsed < 20000) {
          setStatus("Connected");
          setData(json); // keep values
        } else {
          setStatus("Disconnected");
          setData(null); // reset to defaults
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setStatus("Disconnected");
        setData(null); // reset to defaults
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
      <h2>🕒 Time: {data?.time ?? "N/A"}</h2>
      <h2>📅 Date: {data?.date ?? "N/A"}</h2>
      <h2>💧 Turbidity: {data?.turbid ?? "N/A"} NTU</h2>
      <h2>🧪 pH Level: {data?.ph ?? "N/A"}</h2>
      <h2>🌡️ Water Temperature: {data?.water_temp ?? "N/A"} °C</h2>
      <h2>
        Water Level Normal:{" "}
        {data ? (data.is_water_lvl_normal ? "✅ Yes" : "❌ No") : "N/A"}
      </h2>
      <h2>TDS: {data?.tds ?? "N/A"} ppm</h2>
      <h2>
        Web Time:{" "}
        {data?.web_time ? new Date(data.web_time).toLocaleTimeString() : "N/A"}
      </h2>
    </main>
  );
}
