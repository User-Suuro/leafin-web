// File: src/app/api/device-status-check/route.ts
import { getLastSeen } from "@/lib/device-status-store";

export async function GET() {
  const lastSeen = getLastSeen();
  const now = new Date();

  let isOnline = false;
  if (lastSeen) {
    const diff = (now.getTime() - lastSeen.getTime()) / 1000; // seconds
    isOnline = diff < 10; // Arduino is online if pinged within last 10 seconds
  }

  return new Response(JSON.stringify({
    online: isOnline,
    lastSeen: lastSeen?.toISOString() ?? null,
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
