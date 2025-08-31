import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";

// GET all expenses
export async function GET() {
  try {
    const result = await db.select().from(expenses).orderBy(expenses.expenseId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// POST new expense
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Require fishBatch if category is "feed"
    if (body.category === "feed" && !body.relatedFishBatchId) {
      return NextResponse.json(
        { error: "Feed expenses must have a relatedFishBatchId" },
        { status: 400 }
      );
    }

    const newExpense = {
      expenseDate: new Date(),
      category: body.category,
      description: body.description,
      amount: body.amount,
      relatedFishBatchId: body.category === "feed" ? body.relatedFishBatchId : null,
      relatedPlantBatchId: null, // optional rule kung may plant logic ka
    };

    const result = await db.insert(expenses).values(newExpense);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
