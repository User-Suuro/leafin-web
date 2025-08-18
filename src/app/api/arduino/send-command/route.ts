// app/api/arduino/send-command/route.ts
let lastCommand: string | null = null;

export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    if (command) {
      lastCommand = command;
      console.log("🌐 Web sent command:", command);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ success: false, error: "No command found" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: "Invalid request" }), { status: 400 });
  }
}

export async function GET() {
  const cmd = lastCommand;
  lastCommand = null; // clear after sending
  return new Response(JSON.stringify({ command: cmd }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
