export const runtime = "edge";                   // optional: keeps it very fast

let lastSeen = 0;                               // milliseconds since epoch

export async function POST() {
  lastSeen = Date.now();
  // 204 = No Content. Cheaper than 200 for a heartbeat.
  return new Response(null, { status: 204 });
}

export async function GET() {
  // Allow you to check the value manually if you wish.
  return Response.json({ lastSeen });
}
