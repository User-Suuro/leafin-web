import { db } from "@/db";
import { expenses } from "@/db/schema/expenses";
import { eq } from "drizzle-orm";
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await db.delete(expenses).where(eq(expenses.expenseId, Number(id)));
    return new Response(JSON.stringify({ message: "Expense deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete expense", details: String(error) }),
      { status: 500 }
    );
  }
}