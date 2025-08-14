// File: src/app/api/send-sensor-data/route.ts
import { NextResponse } from "next/server";

let lastSensorData = {
  connected: false,
  time: "N/A",
  date: "N/A",
  ph: "N/A",
  turbid: "N/A",
  water_temp: "N/A",
  is_water_lvl_normal: "N/A",
  web_time: 0,
  timestamp: 0, // track last update
};

export async function POST(req: Request) {
  const body = await req.json();

  lastSensorData = {
    connected: body.connected,
    time: body.time,
    date: body.date,
    ph: body.ph,
    turbid: body.turbid,
    water_temp: body.water_temp,
    is_water_lvl_normal: body.is_water_lvl_normal,
    web_time: Date.now(),
    timestamp: Date.now(),
  };

  return NextResponse.json({ success: true });
}

export async function GET() {
  const now = Date.now();

  // If last update was more than 20 seconds ago, reset to defaults
  if (now - lastSensorData.timestamp > 20000) {
    return NextResponse.json({
      connected: false,
      time: "N/A",
      date: "N/A",
      ph: "N/A",
      turbid: "N/A",
      water_temp: "N/A",
      is_water_lvl_normal: "N/A",
      web_time: 0,
    });
  }

  return NextResponse.json(lastSensorData);
}
