// // File: src/app/api/send-ph/route.ts

// import { NextResponse } from "next/server";

// // Temporary in-memory store (you can later use a database)
// let latestPh: number | null = null;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { ph } = body;

//     if (typeof ph !== "number") {
//       return NextResponse.json({ error: "Invalid pH value" }, { status: 400 });
//     }

//     latestPh = ph;

//     return NextResponse.json({ message: "pH value received", ph });
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
//   }
// }

// export async function GET() {
//   return NextResponse.json({ ph: latestPh ?? 0 });
// }
