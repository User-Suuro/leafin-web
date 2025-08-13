// app/api/plant-batch/timeline/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db"; // your Drizzle DB instance
import { plantBatch } from "@/db/schema/plantBatch";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch batches sorted by dateAdded
    const batches = await db
      .select({
        id: plantBatch.plantBatchId,
        quantity: plantBatch.plantQuantity,
        days: plantBatch.plantDays,
        dateAdded: plantBatch.dateAdded,
        condition: plantBatch.condition,
        // Example: expectedHarvestDate = dateAdded + plantDays
        expectedHarvestDate: sql`
          DATE_ADD(${plantBatch.dateAdded}, INTERVAL ${plantBatch.plantDays} DAY)
        `,
      })
      .from(plantBatch)
      .orderBy(plantBatch.dateAdded);

    return NextResponse.json({
      success: true,
      data: batches,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch plant batch timeline." },
      { status: 500 }
    );
  }
}
