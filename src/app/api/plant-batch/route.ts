// app/api/plant-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all "Growing" plant batches
    const growingBatches = await db
      .select()
      .from(plantBatch)
      .where(eq(plantBatch.condition, "Growing"));

    const batchesWithDays = await Promise.all(
      growingBatches.map(async (b) => {
        const created = new Date(b.dateAdded);
        const ageDays = Math.floor(
          (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
        );

        // If >= 45 days, update to "Ready"
        if (ageDays >= 45 && b.condition === "Growing") {
          await db
            .update(plantBatch)
            .set({ condition: "Ready" })
            .where(eq(plantBatch.plantBatchId, b.plantBatchId));
        }

        return {
          ...b,
          plantDays: ageDays,
        };
      })
    );

    // ✅ Sum only "Growing" plants
    const totalPlants = batchesWithDays
      .filter((b) => b.condition === "Growing")
      .reduce((sum, b) => sum + (b.plantQuantity ?? 0), 0);

    return NextResponse.json({
      batches: batchesWithDays,
      totalPlants,
    });
  } catch (error) {
    console.error("Error fetching growing plant batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch growing plant batches" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { plantQuantity } = data;

    await db.insert(plantBatch).values({
      plantQuantity,
      dateAdded: new Date(),
      plantDays: 0,
      condition: "Growing",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting plant batch:", error);
    return NextResponse.json(
      { error: "Failed to insert plant batch" },
      { status: 500 }
    );
  }
}
