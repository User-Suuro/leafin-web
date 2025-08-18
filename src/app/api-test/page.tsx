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
  const [reply, setReply] = useState<string>(""); // latest reply from server for Arduino
  const [messageStatus, setMessageStatus] = useState<string>(""); // confirm UI->server send

  const sendHello = async () => {
    try {
      const res = await fetch("/api/arduino/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "hello" }), // server stores this
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();
      setMessageStatus(`✅ Sent: ${json.received}`);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessageStatus("❌ Error sending message");
    }
  };

  // 🔹 Poll sensor data + Arduino reply
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sensorRes, replyRes] = await Promise.all([
          fetch("/api/send-sensor-data", { cache: "no-store" }),
          fetch("/api/arduino/reply", { cache: "no-store" }),
        ]);

        const sensorJson = await sensorRes.json();
        const replyJson = await replyRes.json();

        // Handle sensor data
        if (!sensorJson.web_time) {
          setStatus("Disconnected");
          setData(null);
        } else {
          const now = Date.now();
          const elapsed = now - sensorJson.web_time;
          if (elapsed < 20000) {
            setStatus("Connected");
            setData(sensorJson);
          } else {
            setStatus("Disconnected");
            setData(null);
          }
        }

        // Handle reply from server (what Arduino will fetch)
        if (replyJson.reply) {
          setReply(replyJson.reply);
        }
      } catch (error) {
        console.error("Error fetching:", error);
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

      {/* Button to set reply */}
      <button
        onClick={sendHello}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mt-4"
      >
        Send Hello
      </button>

      {messageStatus && (
        <p className="text-gray-600 mt-2">{messageStatus}</p>
      )}

      {/* Shows the reply value Arduino will fetch */}
      {reply && (
        <p className="text-lg text-gray-700 mt-2">
          📡 Current server reply for Arduino:{" "}
          <span className="font-bold">{reply}</span>
        </p>
      )}
    </main>
  );
}
