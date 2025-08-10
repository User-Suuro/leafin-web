// app/api/fish-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all "Growing" batches
    const growingBatches = await db
      .select()
      .from(fishBatch)
      .where(eq(fishBatch.condition, "Growing"));

    const batchesWithDays = await Promise.all(
      growingBatches.map(async (b) => {
        const created = new Date(b.dateAdded);
        const ageDays = Math.floor(
          (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
        );

        // If >= 120 days, update to "Ready"
        if (ageDays >= 120 && b.condition === "Growing") {
          await db
            .update(fishBatch)
            .set({ condition: "Ready" })
            .where(eq(fishBatch.fishBatchId, b.fishBatchId));
        }

        return {
          ...b,
          fishDays: ageDays,
        };
      })
    );

    // ✅ Explicitly sum only "Growing" batches
    const totalFish = batchesWithDays
      .filter((b) => b.condition === "Growing")
      .reduce((sum, b) => sum + (b.fishQuantity ?? 0), 0);

    return NextResponse.json({
      batches: batchesWithDays,
      totalFish,
    });
  } catch (error) {
    console.error("Error fetching growing fish batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch growing batches" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fishQuantity, aquariumId } = data;

    await db.insert(fishBatch).values({
      fishQuantity,
      dateAdded: new Date(),
      fishDays: 0,
      condition: "Growing",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting fish batch:", error);
    return NextResponse.json(
      { error: "Failed to insert fish batch" },
      { status: 500 }
    );
  }
}
