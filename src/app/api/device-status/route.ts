export async function GET() {
  return new Response(JSON.stringify({
    status: "connected",
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
