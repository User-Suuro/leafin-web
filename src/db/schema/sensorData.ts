import {
  mysqlTable,
  serial,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const sensorData = mysqlTable("sensor_data", {
  id: serial("id").primaryKey(),
  connected: boolean("connected").notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  ph: varchar("ph", { length: 50 }).notNull(),
  turbid: varchar("turbid", { length: 50 }).notNull(),
  water_temp: varchar("water_temp", { length: 50 }).notNull(),
  tds: varchar("tds", { length: 50 }).notNull(),
  is_water_lvl_normal: boolean("is_water_lvl_normal").notNull(),
  nh3_gas: varchar("nh3_gas", { length: 50 }).notNull(),
  fraction_nh3: varchar("fraction_nh3", { length: 50 }).notNull(),
  total_ammonia: varchar("total_ammonia", { length: 50 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
