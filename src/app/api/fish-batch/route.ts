// app/api/fish-batch/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";

export async function GET() {
  try {
    // ✅ Get ALL batches, no filtering
    const allBatches = await db.select().from(fishBatch);

    const batchesWithDays = allBatches.map((b) => {
      const created = new Date(b.dateAdded);
      const ageDays = Math.floor(
        (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...b,
        fishDays: ageDays,
      };
    });

    // ✅ Sum all fish quantities across all batches
    const totalFish = batchesWithDays.reduce(
      (sum, b) => sum + (b.fishQuantity ?? 0),
      0
    );

    return NextResponse.json({
      batches: batchesWithDays,
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
