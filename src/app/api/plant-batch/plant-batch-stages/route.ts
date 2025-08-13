import { NextResponse } from "next/server";
import { db } from "@/db";
import { plantBatch } from "@/db/schema/plantBatch";

const LETTUCE_STAGES = [
  { name: "Seedling Stage", maxDays: 14 },
  { name: "Vegetative Growth", maxDays: 35 },
  { name: "Harvest Ready", maxDays: 50 },
  { name: "Bolting & Seeding", maxDays: Infinity },
];

export async function GET() {
  try {
    const batches = await db.select().from(plantBatch);

    // Initialize stage counts
    const stageCounts: Record<string, number> = {};
    LETTUCE_STAGES.forEach((s) => (stageCounts[s.name] = 0));

    // Count batches per stage
    batches.forEach((b) => {
      const days = b.plantDays ?? 0;
      const stage = LETTUCE_STAGES.find((s) => days <= s.maxDays)?.name ?? "Unknown";
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    });

    return NextResponse.json(stageCounts);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
