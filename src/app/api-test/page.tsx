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
  nh3_gas: string;
  fraction_nh3: string;
  total_ammonia: string;
  web_time: number;
}

export default function ApiTest() {
  const [data, setData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<"Connected" | "Disconnected">("Disconnected");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/send-sensor-data", { cache: "no-store" });
        const json = await res.json();

        if (!json.web_time) {
          setStatus("Disconnected");
          setData(null);
          return;
        }

        const now = Date.now();
        const elapsed = now - json.web_time;

        if (elapsed < 20000) {
          setStatus("Connected");
          setData(json);
        } else {
          setStatus("Disconnected");
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setStatus("Disconnected");
        setData(null);
      }
    };

    // Fetch immediately, then every 6s
    fetchData();
    const interval = setInterval(fetchData, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>
        Device Status: {status === "Connected" ? "✅ Connected" : "❌ Disconnected"}
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
      <h2>NH3 Gas: {data?.nh3_gas ?? "N/A"} ppm</h2>
      <h2>Fraction NH3: {data?.fraction_nh3 ?? "N/A"} ppm</h2>
      <h2>Total Ammonia: {data?.total_ammonia ?? "N/A"} ppm</h2>
      <h2>
        Web Time:{" "}
        {data?.web_time ? new Date(data.web_time).toLocaleTimeString() : "N/A"}
      </h2>
    </main>
  );
}
