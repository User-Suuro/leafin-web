import { NextApiRequest, NextApiResponse } from "next";

let lastReply: string | null = null; // store the last Arduino reply (for debugging)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { reply } = req.body; // Expecting { reply: "hi" }
      lastReply = reply;

      console.log("Arduino replied:", reply);

      return res.status(200).json({ success: true, received: reply });
    } catch (err) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }
  }

  if (req.method === "GET") {
    // (Optional) allow browser or dev to check last reply
    return res.status(200).json({ lastReply });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
