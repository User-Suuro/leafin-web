// db/fishBatch.ts
import { mysqlTable, serial, int, datetime, varchar } from "drizzle-orm/mysql-core";

export const fishBatch = mysqlTable("fish_batch", {
  fishBatchId: serial("fish_batch_id").primaryKey(),
  fishQuantity: int("fish_quantity").notNull(),
  fishDays: int("fish_days").default(0),
  dateAdded: datetime("date_added").notNull(),
  condition: varchar("conditions", { length: 50 }),
});

export type FishBatch = typeof fishBatch.$inferSelect;
export type NewFishBatch = typeof fishBatch.$inferInsert;
