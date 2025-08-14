// app/api/batches/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { plantBatch } from "@/db/schema/plantBatch";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "fish") {
  const batches = await db
    .select({
      id: fishBatch.fishBatchId,
      name: sql<string>`CONCAT('Batch #', ${fishBatch.fishBatchId})`,
    })
    .from(fishBatch)
    .where(eq(fishBatch.condition, "Grow-out Stage"));
  return NextResponse.json(batches);
}

if (type === "plant") {
  const batches = await db
    .select({
      id: plantBatch.plantBatchId,
      name: sql<string>`CONCAT('Batch #', ${plantBatch.plantBatchId})`,
    })
    .from(plantBatch)
    .where(eq(plantBatch.condition, "Vegetative Growth"));
  return NextResponse.json(batches);
}


    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}
