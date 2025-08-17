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
  time: varchar("time", { length: 100 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  ph: varchar("ph", { length: 100 }).notNull(),
  turbid: varchar("turbid", { length: 100 }).notNull(),
  water_temp: varchar("water_temp", { length: 100 }).notNull(),
  tds: varchar("tds", { length: 100 }).notNull(),
  is_water_lvl_normal: boolean("is_water_lvl_normal").notNull(),
  nh3_gas: varchar("nh3_gas", { length: 100 }).notNull(),
  fraction_nh3: varchar("fraction_nh3", { length: 100 }).notNull(),
  total_ammonia: varchar("total_ammonia", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
