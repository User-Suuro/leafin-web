import { NextRequest, NextResponse } from "next/server";

let lastCommand: string | null = null; // what web wants Arduino to do
let lastReply: string | null = null;   // Arduino's last reply

// Arduino or Web client sends POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { command, reply } = body;

    if (command) {
      // Web client sending command to Arduino
      lastCommand = command;
      console.log("🌐 Web sent command:", command);
      return NextResponse.json({ success: true, message: "Command stored" });
    }

    if (reply) {
      // Arduino sending reply back
      lastReply = reply;
      console.log("🤖 Arduino replied:", reply);
      return NextResponse.json({ success: true, received: reply });
    }

    return NextResponse.json({ success: false, error: "No command or reply found" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

// Arduino polls GET for latest command
export async function GET() {
  if (lastCommand) {
    const cmd = lastCommand;
    lastCommand = null; // clear after sending
    return NextResponse.json({ command: cmd });
  }

  return NextResponse.json({ command: null, lastReply });
}
