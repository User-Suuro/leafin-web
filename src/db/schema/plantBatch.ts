// db/plantBatch.ts
import { mysqlTable, serial, int, datetime, varchar } from "drizzle-orm/mysql-core";

export const plantBatch = mysqlTable("plant_batch", {
  plantBatchId: serial("plant_batch_id").primaryKey(),
  plantQuantity: int("plant_quantity").notNull(),
  plantDays: int("plant_days").default(0),
  dateAdded: datetime("date_added").notNull(),
  condition: varchar("conditions", { length: 50 }),
});

export type PlantBatch = typeof plantBatch.$inferSelect;
export type NewPlantBatch = typeof plantBatch.$inferInsert;
