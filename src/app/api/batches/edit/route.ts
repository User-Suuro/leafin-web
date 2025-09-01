import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { plantBatch } from "@/db/schema/plantBatch";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { type, batchId, updates } = await req.json() as { type: "fish" | "plant"; batchId: number; updates: Record<string, any> };
    if (!batchId || !type || !updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Invalid request or no updates" }, { status: 400 });
    }

    const table = type === "fish" ? fishBatch : plantBatch;
    const idColumn = type === "fish" ? fishBatch.fishBatchId : plantBatch.plantBatchId;

    const [batch] = await db.select().from(table).where(eq(idColumn, batchId));
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    await db.update(table).set(updates).where(eq(idColumn, batchId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit error:", error);
    return NextResponse.json({ error: "Failed to edit batch", details: (error as Error).message }, { status: 500 });
  }
}
