import { NextResponse } from "next/server";

let latestSensorData: any = null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    latestSensorData = body;

    console.log("📡 Sensor Data Received:", body);

    return NextResponse.json({ success: true, message: "Data stored" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ latestSensorData });
}
