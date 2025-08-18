import { NextApiRequest, NextApiResponse } from "next";

let lastCommand: string | null = null; // what web wants Arduino to do
let lastReply: string | null = null;   // Arduino's last reply

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { command, reply } = req.body;

      if (command) {
        // Web client sending command to Arduino
        lastCommand = command;
        console.log("🌐 Web sent command:", command);
        return res.status(200).json({ success: true, message: "Command stored" });
      }

      if (reply) {
        // Arduino sending reply back
        lastReply = reply;
        console.log("🤖 Arduino replied:", reply);
        return res.status(200).json({ success: true, received: reply });
      }

      return res.status(400).json({ success: false, error: "No command or reply found" });
    } catch (err) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }
  }

  if (req.method === "GET") {
    // Arduino polls for latest command
    if (lastCommand) {
      const cmd = lastCommand;
      lastCommand = null; // clear after sending (so Arduino doesn’t repeat forever)
      return res.status(200).json({ command: cmd });
    }
    return res.status(200).json({ command: null, lastReply });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
