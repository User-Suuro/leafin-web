// ./src/app/api/arduino/reply/route.ts
import { NextRequest, NextResponse } from "next/server";

let lastReply: string | null = null; // store the last Arduino reply

// Handle POST requests (Arduino sends reply here)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reply } = body; // Expecting { reply: "hi" }
    lastReply = reply;

    console.log("Arduino replied:", reply);

    return NextResponse.json({ success: true, received: reply });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

// Handle GET requests (browser/dev check last reply)
export async function GET() {
  return NextResponse.json({ lastReply });
}
