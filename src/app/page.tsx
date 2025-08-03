"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"connected" | "disconnected">("disconnected");
  const [weight, setWeight] = useState<number | null>(null);
  const [turbidity, setTurbidity] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res1 = await fetch("/api/device-status-check", { cache: "no-store" });
        const json1 = await res1.json();
        setStatus(json1.online ? "connected" : "disconnected");

        const res2 = await fetch("/api/send-weight", { cache: "no-store" });
        const json2 = await res2.json();
        setWeight(json2.weight);

        const res3 = await fetch("/api/send-turbidity", { cache: "no-store" });
        const json3 = await res3.json();
        setTurbidity(json3.turbidity);
      } catch (error) {
        console.error("Error fetching status, weight, or turbidity", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>Device is: {status === "connected" ? "✅ Connected" : "❌ Disconnected"}</h1>
      <h2>Weight: {weight !== null ? `${weight.toFixed(2)} g` : "Loading..."}</h2>
      <h2>Turbidity: {turbidity !== null ? `${turbidity.toFixed(2)} NTU` : "Loading..."}</h2>
    </main>
  );
}
