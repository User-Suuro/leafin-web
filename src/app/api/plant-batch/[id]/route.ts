// app/api/plant-batch/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const batchId = Number(params.id);

    const batch = await db
      .select()
      .from(plantBatch)
      .where(eq(plantBatch.plantBatchId, batchId))
      .limit(1);

    if (!batch.length) {
      return NextResponse.json({ error: "Plant batch not found" }, { status: 404 });
    }

    const created = new Date(batch[0].dateAdded);
    const ageDays = Math.floor(
      (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      ...batch[0],
      ageDays,
    });
  } catch (error) {
    console.error("Error fetching plant batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch plant batch" },
      { status: 500 }
    );
  }
}
