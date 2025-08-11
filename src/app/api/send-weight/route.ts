// // File: src/app/api/send-weight/route.ts
// import { NextRequest, NextResponse } from "next/server";

// let lastWeight = 0;

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     if (typeof body.weight !== "number") {
//       return NextResponse.json({ success: false, message: "Invalid weight" }, { status: 400 });
//     }

//     lastWeight = body.weight;
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
//   }
// }

// export function GET() {
//   return NextResponse.json({ weight: lastWeight });
// }
