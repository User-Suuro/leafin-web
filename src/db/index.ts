import "@/lib/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Create the MySQL connection
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0,
});

export const db = drizzle({ client: connection });
