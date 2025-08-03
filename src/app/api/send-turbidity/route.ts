// File: src/app/api/send-turbidity/route.ts

import { NextRequest, NextResponse } from "next/server";

let latestTurbidity = 0;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const turbidity = body.turbidity;

  if (typeof turbidity === "number") {
    latestTurbidity = turbidity;
    return NextResponse.json({ message: "Turbidity received" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid turbidity value" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ turbidity: latestTurbidity }, { status: 200 });
}
    