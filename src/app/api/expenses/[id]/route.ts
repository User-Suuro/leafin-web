import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await db
      .delete(expenses)
      .where(eq(expenses.expenseId, Number(params.id))); // ✅ use expenseId here

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
