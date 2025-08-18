import { NextResponse } from "next/server";

let latestReply: string | null = null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    latestReply = body.message || null;

    console.log("💻 Web sent reply:", latestReply);

    return NextResponse.json({ success: true, reply: latestReply });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

// Arduino fetches this
export async function GET() {
  const response = { reply: latestReply || "" };
  latestReply = null; // clear once fetched
  return NextResponse.json(response);
}
