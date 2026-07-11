import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { db } from "./db";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Starting database clean-up of brands...");
  try {
    // Drop the column (CASCADE automatically drops the foreign key constraint)
    await db.execute(sql`ALTER TABLE "products" DROP COLUMN IF EXISTS "brand_id" CASCADE`);
    console.log("Dropped brand_id column.");

    // Drop the table
    await db.execute(sql`DROP TABLE IF EXISTS "brands" CASCADE`);
    console.log("Dropped brands table.");

    console.log("✅ Database schema cleaned up successfully!");
  } catch (error) {
    console.error("❌ Database clean-up failed:", error);
  }
}

run();
