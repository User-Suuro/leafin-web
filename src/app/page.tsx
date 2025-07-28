export default async function HomePage() {
  const res = await fetch("https://esp-conn-check.vercel.app/api/device-status", { cache: "no-store" });
  const data = await res.json();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Connection Status</h1>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Timestamp:</strong> {data.timestamp}</p>
    </main>
  );
}

