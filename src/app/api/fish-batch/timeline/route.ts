// app/api/fish-batch/timeline/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch batches sorted by dateAdded
    const batches = await db
      .select({
        id: fishBatch.fishBatchId, // only the ID like B1, B2
        quantity: fishBatch.fishQuantity,
        days: fishBatch.fishDays,
        dateAdded: fishBatch.dateAdded,
        condition: fishBatch.condition,
        expectedHarvestDate: sql`
          DATE_ADD(${fishBatch.dateAdded}, INTERVAL ${fishBatch.fishDays} DAY)
        `,
      })
      .from(fishBatch)
      .orderBy(fishBatch.dateAdded);

    return NextResponse.json(batches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch fish batch timeline." },
      { status: 500 }
    );
  }
}
