// File: src/app/api/send-sensor-data/route.ts
import { NextResponse } from "next/server";

let lastSensorData = {
  time: "N/A",
  date: "N/A",
  ph: "N/A",
  turbid: "N/A",
  timestamp: 0,
};

export async function POST(req: Request) {
  const body = await req.json();

  // Update the stored data
  lastSensorData = {
    time: body.time,
    date: body.date,
    ph: body.ph,
    turbid: body.turbid,
    timestamp: Date.now(),
  };

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(lastSensorData);
}
