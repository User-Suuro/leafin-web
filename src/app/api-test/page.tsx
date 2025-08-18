"use client";

import { useEffect, useState } from "react";

interface SensorData {
  connected: boolean;
  time: string;
  date: string;
  ph: number;
  turbid: number;
  water_temp: number;
  tds: number;
  is_water_lvl_normal: boolean;
  nh3_gas: number;
  fraction_nh3: number;
  total_ammonia: number;
  web_time: number;
}

export default function ApiTest() {
  const [data, setData] = useState<SensorData | null>(null);
  const [status, setStatus] = useState<"Connected" | "Disconnected">("Disconnected");
  const [lastReply, setLastReply] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<string>("");

  const sendHello = async () => {
    try {
      const res = await fetch("/api/arduino/send-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: "hello" }),
      });
      if (!res.ok) throw new Error("Server error");
      setMessageStatus('✅ Sent command "hello"');
    } catch (err) {
      console.error(err);
      setMessageStatus("❌ Error sending command");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/arduino/send-data", { cache: "no-store" });
        const json: SensorData & { lastReply?: string } = await res.json();

        const now = Date.now();
        if (!json.web_time || now - json.web_time > 20000) {
          // older than 20s → disconnected
          setStatus("Disconnected");
          setData(null);
        } else {
          setStatus("Connected");
          setData(json);
        }

        if (json.lastReply) setLastReply(json.lastReply);
      } catch (err) {
        console.error(err);
        setStatus("Disconnected");
        setData(null);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Device Status: {status === "Connected" ? "✅ Connected" : "❌ Disconnected"}</h1>
      <h2>🕒 Time: {data?.time ?? "N/A"}</h2>
      <h2>📅 Date: {data?.date ?? "N/A"}</h2>
      <h2>💧 Turbidity: {data?.turbid ?? "N/A"} NTU</h2>
      <h2>🧪 pH Level: {data?.ph ?? "N/A"}</h2>
      <h2>🌡️ Water Temperature: {data?.water_temp ?? "N/A"} °C</h2>
      <h2>Water Level Normal: {data ? (data.is_water_lvl_normal ? "✅ Yes" : "❌ No") : "N/A"}</h2>
      <h2>TDS: {data?.tds ?? "N/A"} ppm</h2>
      <h2>NH3 Gas: {data?.nh3_gas ?? "N/A"} ppm</h2>
      <h2>Fraction NH3: {data?.fraction_nh3 ?? "N/A"} %</h2>
      <h2>Total Ammonia: {data?.total_ammonia ?? "N/A"} ppm</h2>
      <h2>Web Time: {data?.web_time ? new Date(data.web_time).toLocaleTimeString() : "N/A"}</h2>

      <button onClick={sendHello} className="px-6 py-3 bg-blue-500 text-white rounded-lg mt-4">
        Send Hello
      </button>

      {messageStatus && <p>{messageStatus}</p>}
      {lastReply && <p>🤖 Arduino last replied: {lastReply}</p>}
    </main>
  );
}
