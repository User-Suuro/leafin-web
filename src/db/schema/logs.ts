// db/schema/logs.ts
import { mysqlTable, int, datetime, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const logs = mysqlTable("logs", {
  logId: int("log_id").primaryKey().autoincrement(),
  eventTime: datetime("event_time").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes"),

  // Foreign keys
  taskId: int("task_id"),
  relatedFishSaleId: int("related_fish_sale_id"),
  relatedPlantSaleId: int("related_plant_sale_id"),
  relatedExpenseId: int("related_expense_id"),
});
