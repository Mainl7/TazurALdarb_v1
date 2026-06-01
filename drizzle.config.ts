import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    ...(process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {}),
    database: process.env.DB_NAME || "tazur_cardz",
  },
  verbose: true,
  strict: true,
} satisfies Config;
