// db/schema/logs.ts
import { mysqlTable, int, datetime, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { plantBatch } from "./plantBatch";
import { fishBatch } from "./fishBatch";
import { fishSales } from "./fishSales";
import { plantSales } from "./plantSales";
import { expenses } from "./expenses";
import { tasks } from "./tasks";

export const logs = mysqlTable("logs", {
  logId: int("log_id").primaryKey().autoincrement(),
  eventTime: datetime("event_time").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes"),

  // ✅ Foreign keys to other tables
  taskId: int("task_id").references(() => tasks.taskId, { onDelete: "cascade" }),

  relatedFishSaleId: int("related_fish_sale_id").references(() => fishSales.fishSaleId, { onDelete: "cascade" }),
  relatedPlantSaleId: int("related_plant_sale_id").references(() => plantSales.plantSaleId, { onDelete: "cascade" }),
  relatedExpenseId: int("related_expense_id").references(() => expenses.expenseId, { onDelete: "cascade" }),

  // ✅ New Foreign Keys to batch tables
  plantBatchId: int("plant_batch_id").references(() => plantBatch.plantBatchId, { onDelete: "cascade" }),
  fishBatchId: int("fish_batch_id").references(() => fishBatch.fishBatchId, { onDelete: "cascade" }),
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
