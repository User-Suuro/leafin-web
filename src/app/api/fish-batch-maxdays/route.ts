// app/api/fish-batcaxdayh-ms/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { sql } from "drizzle-orm"; // <-- import eq here

export async function GET() {
  try {
    // Query max fish_days among all batches with condition "Growing"
    const result = await db
      .select({
        maxDays: sql`MAX(${fishBatch.fishDays})`,
      })
      .from(fishBatch)

    const maxDays = result[0]?.maxDays ?? 0;

    return NextResponse.json({ maxDays });
  } catch (error) {
    console.error("Error fetching max fish days:", error);
    return NextResponse.json(
      { error: "Failed to fetch max fish days" },
      { status: 500 }
    );
  }
}
