// File: src/app/api/device-status/route.ts
import { updateLastSeen } from "@/lib/device-status-store";

export async function GET() {
  updateLastSeen();

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
