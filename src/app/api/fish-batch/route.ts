// app/api/fish-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBatches = await db.select().from(fishBatch);

    const updatedBatches = await Promise.all(
      allBatches.map(async (b) => {
        const ageDays = Math.floor(
          (Date.now() - new Date(b.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Determine stage based on TILAPIA_STAGES
        let stage = "Larval Stage";
        if (ageDays > 14 && ageDays <= 60) stage = "Juvenile Stage";
        else if (ageDays > 60 && ageDays <= 120) stage = "Grow-Out Stage";
        else if (ageDays > 120) stage = "Harvest";

        // Update condition if outdated
        if (b.condition !== stage) {
          await db.update(fishBatch)
            .set({ condition: stage }) // <— use 'condition' not 'conditions'
            .where(eq(fishBatch.fishBatchId, b.fishBatchId));
        }

        return { ...b, fishDays: ageDays, condition: stage };
      })
    );

    const totalFish = updatedBatches.reduce(
      (sum, b) => sum + (b.fishQuantity ?? 0),
      0
    );

    return NextResponse.json({
      batches: updatedBatches,
      totalFish,
    });
  } catch (error) {
    console.error("Error fetching fish batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish batches" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fishQuantity } = data;

    await db.insert(fishBatch).values({
      fishQuantity,
      dateAdded: new Date(),
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
