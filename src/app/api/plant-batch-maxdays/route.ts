import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        maxDays: sql`MAX(${plantBatch.plantDays})`,
      })
      .from(plantBatch)

    const maxDays = result[0]?.maxDays ?? 0;

    return NextResponse.json({ maxDays });
  } catch (error) {
    console.error("Error fetching max plant days:", error);
    return NextResponse.json(
      { error: "Failed to fetch max plant days" },
      { status: 500 }
    );
  }
}
