export default async function HomePage() {
  const res = await fetch("https://esp-conn-check.vercel.app/api/device-status", { cache: "no-store" });

  if (!res.ok) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Connection Error</h1>
        <p>Could not fetch status. Server returned: {res.status} - {res.statusText}</p>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Connection Status</h1>
      <p><strong>Status:</strong> {data.status}</p>
      <p><strong>Timestamp:</strong> {data.timestamp}</p>
    </main>
  );
}
