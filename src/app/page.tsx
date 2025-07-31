export default async function HomePage() {
  let data: { status: string; timestamp?: string } | null = null;
  let error: string | null = null;

  try {
    const res = await fetch("/api/device-status", { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    data = await res.json();
  } catch (err: any) {
    error = err.message || "Unknown error occurred";
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ESP Connection Status</h1>

      {error ? (
        <>
          <h2 style={{ color: "crimson" }}>Connection Error</h2>
          <p>{error}</p>
        </>
      ) : (
        <>
          <p><strong>Status:</strong> {data?.status}</p>
          <p><strong>Timestamp:</strong> {data?.timestamp ?? "N/A"}</p>
        </>
      )}
    </main>
  );
}
