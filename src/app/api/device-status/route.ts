// File: src/app/api/device-status/route.ts

let lastSeen: Date | null = null;

export async function GET() {
  // Update the last seen timestamp whenever this endpoint is accessed
  lastSeen = new Date();

  return new Response(JSON.stringify({
    status: "connected",
    timestamp: lastSeen.toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// Helper function to expose lastSeen for frontend polling
export function getLastSeen() {
  return lastSeen;
}
