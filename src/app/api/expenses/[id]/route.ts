import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    await db.delete(expenses).where(eq(expenses.expenseId, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
