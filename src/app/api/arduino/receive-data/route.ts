// File: src/app/api/arduino/receive-data/route.ts
import { NextResponse } from "next/server";

// in-memory variable to hold the last Arduino reply (for demo)
let lastReply: string | null = null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Example: Your Arduino .cpp/.h will handle receiving "hello"
    // and sending back "hi". For now, just simulate a reply here.
    if (body.message === "hello") {
      lastReply = "hi"; // simulate Arduino reply
    } else {
      lastReply = `Arduino received: ${body.message}`;
    }

    return NextResponse.json({ success: true, reply: lastReply });
  } catch (err) {
    console.error("POST /api/arduino/receive-data failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      reply: lastReply ?? "No reply yet",
    });
  } catch (err) {
    console.error("GET /api/arduino/receive-data failed:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
