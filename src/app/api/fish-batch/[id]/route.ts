// app/api/fish-batch/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const batchId = Number(params.id);
    if (isNaN(batchId)) {
      return NextResponse.json({ error: "Invalid batch id" }, { status: 400 });
    }

    const batch = await db
      .select()
      .from(fishBatch)
      .where(eq(fishBatch.fishBatchId, batchId))
      .limit(1);

    if (!batch.length) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    const created = new Date(batch[0].dateAdded);
    const ageDays = Math.floor(
      (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({ ...batch[0], ageDays });
  } catch (error) {
    console.error("Error fetching batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch batch" },
      { status: 500 }
    );
  }
}
