// app/api/fish-batch/batches-fish/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const batches = await db
      .select({
        id: fishBatch.fishBatchId,
        name: sql<string>`CONCAT('Batch #', ${fishBatch.fishBatchId})`,
      })
      .from(fishBatch)
      .where(eq(fishBatch.condition, "Grow-out Stage"));

    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching fish batches:", error);
    return NextResponse.json(
      { error: "Failed to fetch fish batches" },
      { status: 500 }
    );
  }
}
