// app/api/plant-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allBatches = await db.select().from(plantBatch);

    const updatedBatches = await Promise.all(
      allBatches.map(async (b) => {
        const ageDays = Math.floor(
          (Date.now() - new Date(b.dateAdded).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Determine stage
        let stage = "Seedling Stage";
        if (ageDays > 14 && ageDays <= 35) stage = "Vegetative Growth";
        else if (ageDays > 35 && ageDays <= 50) stage = "Harvest Ready";
        else if (ageDays > 50) stage = "Bolting & Seeding";

        // Update condition if outdated
        if (b.condition !== stage) {
          await db.update(plantBatch)
            .set({ condition: stage })
            .where(eq(plantBatch.plantBatchId, b.plantBatchId));
        }

        return { ...b, condition: stage }; // return updated stage
      })
    );

    return NextResponse.json({ batches: updatedBatches });
  } catch (error) {
    console.error("Error fetching plant batches:", error);
    return NextResponse.json({ error: "Failed to fetch plant batches" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { plantQuantity } = data;

    await db.insert(plantBatch).values({
      plantQuantity,
      dateAdded: new Date(),
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
