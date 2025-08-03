import type { NextApiRequest, NextApiResponse } from "next";

// Simulated turbidity value (replace this with your DB or sensor logic)
let latestTurbidity = 0;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { turbidity } = req.body;

    if (typeof turbidity === "number") {
      latestTurbidity = turbidity;
      return res.status(200).json({ message: "Turbidity received" });
    } else {
      return res.status(400).json({ error: "Invalid turbidity value" });
    }
  }

  if (req.method === "GET") {
    return res.status(200).json({ turbidity: latestTurbidity });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
