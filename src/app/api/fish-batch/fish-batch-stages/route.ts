import { NextResponse } from "next/server";
import { db } from "@/db";
import { fishBatch } from "@/db/schema/fishBatch";

const TILAPIA_STAGES = [
  { name: "Larval Stage", maxDays: 14 },
  { name: "Juvenile Stage", maxDays: 60 },
  { name: "Grow-Out Stage", maxDays: 120 },
  { name: "Harvest", maxDays: Infinity },
];

export async function GET() {
  try {
    const batches = await db.select().from(fishBatch);

    // Initialize stage counts
    const stageCounts: Record<string, number> = {};
    TILAPIA_STAGES.forEach((s) => (stageCounts[s.name] = 0));

    // Count batches per stage
    batches.forEach((b) => {
      const days = b.fishDays ?? 0;
      const stage = TILAPIA_STAGES.find((s) => days <= s.maxDays)?.name ?? "Unknown";
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
