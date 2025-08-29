// app/api/plant-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";

export async function GET() {
  try {
    // ✅ Get ALL plant batches, no filtering
    const allBatches = await db.select().from(plantBatch);

    // Calculate plantDays for each batch
    const batchesWithDays = allBatches.map((b) => {
      const created = new Date(b.dateAdded);
      const ageDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...b,
        plantDays: ageDays,
      };
    });

    // Sum total plant quantities
    const totalPlants = batchesWithDays.reduce(
      (sum, b) => sum + (b.plantQuantity ?? 0),
      0
    );

    return NextResponse.json({
      batches: batchesWithDays,
      totalPlants,
    });
  } catch (error) {
    console.error("Error fetching plant batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant batches" },
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
