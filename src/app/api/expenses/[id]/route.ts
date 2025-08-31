import { NextResponse } from "next/server";
import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";

// type definition for params
interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(
  req: Request,
  context: Params // ✅ ito ang tamang type
) {
  const { id } = context.params;

  try {
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
