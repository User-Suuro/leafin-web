// File: src/app/api/device-status-check/route.ts
import { getLastSeen } from "../device-status/route";

export async function GET() {
  const lastSeen = getLastSeen();
  const now = new Date();

  let isOnline = false;
  if (lastSeen) {
    const diff = (now.getTime() - lastSeen.getTime()) / 1000; // in seconds
    isOnline = diff < 10; // Arduino considered connected if pinged in last 10s
  }

  return new Response(JSON.stringify({
    online: isOnline,
    lastSeen: lastSeen?.toISOString() || null,
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
