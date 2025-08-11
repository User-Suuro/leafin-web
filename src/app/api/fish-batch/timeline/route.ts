import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const batches = await db
      .select()
      .from(fishBatch)
      .orderBy(asc(fishBatch.dateAdded));

    // Ensure batches is an array
    const safeBatches = Array.isArray(batches) ? batches : [];

    const timeline = safeBatches.map((batch) => {
      let status: "Completed" | "Upcoming" = "Completed";

      // Adjust this logic depending on your definition of "Upcoming"
      if ((batch.fishDays ?? 0) < 30) {
        status = "Upcoming";
      }

      return {
        date: batch.dateAdded?.toISOString?.().split("T")[0] ?? "Unknown date",
        event: `Batch #${batch.fishBatchId} - ${batch.fishQuantity ?? 0} fish (${batch.condition || "No condition"})`,
        status,
      };
    });

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("Error fetching fish batch timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish batch timeline", timeline: [] },
      { status: 500 }
    );
  }
}
