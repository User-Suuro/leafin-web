import { NextApiRequest, NextApiResponse } from "next";

let lastCommand: string | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { command } = req.body;
    if (command) {
      lastCommand = command;
      console.log("🌐 Web sent command:", command);
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ success: false, error: "No command found" });
  }

  if (req.method === "GET") {
    // Arduino polls command
    const cmd = lastCommand;
    lastCommand = null; // clear after sending
    return res.status(200).json({ command: cmd });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
