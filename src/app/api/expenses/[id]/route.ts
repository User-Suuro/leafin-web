import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    // Extract expenseId from URL
    const url = new URL(req.url);
    const idParam = url.pathname.split("/").pop();
    const expenseId = Number(idParam);

    if (isNaN(expenseId)) {
      return NextResponse.json({ error: "Invalid expense id" }, { status: 400 });
    }

    // Delete expense
    await db.delete(expenses).where(eq(expenses.expenseId, expenseId));

    return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense", details: String(error) },
      { status: 500 }
    );
  }
}
