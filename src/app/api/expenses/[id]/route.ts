import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await db.delete(expenses).where(eq(expenses.expenseId, Number(params.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
