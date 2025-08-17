// File: src/app/api/send-sensor-data/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { sensorData } from "@/db/schema/sensorData";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.json();

  await db.insert(sensorData).values({
    connected: body.connected,
    time: body.time,
    date: body.date,
    ph: body.ph,
    turbid: body.turbid,
    water_temp: body.water_temp,
    tds: body.tds,
    is_water_lvl_normal: body.is_water_lvl_normal,
    nh3_gas: body.nh3_gas,
    fraction_nh3: body.fraction_nh3,
    total_ammonia: body.total_ammonia,
    web_time: Date.now(),
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const rows = await db
    .select()
    .from(sensorData)
    .orderBy(desc(sensorData.created_at))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({
      connected: false,
      time: "N/A",
      date: "N/A",
      ph: "N/A",
      turbid: "N/A",
      water_temp: "N/A",
      tds: "N/A",
      is_water_lvl_normal: "N/A",
      nh3_gas: "N/A",
      fraction_nh3: "N/A",
      total_ammonia: "N/A",
      web_time: 0,
    });
  }

  const lastSensorData = rows[0];
  const now = Date.now();

  if (now - lastSensorData.web_time > 20000) {
    return NextResponse.json({
      connected: false,
      time: "N/A",
      date: "N/A",
      ph: "N/A",
      turbid: "N/A",
      water_temp: "N/A",
      tds: "N/A",
      is_water_lvl_normal: "N/A",
      nh3_gas: "N/A",
      fraction_nh3: "N/A",
      total_ammonia: "N/A",
      web_time: 0,
    });
  }

  return NextResponse.json(lastSensorData);
}
