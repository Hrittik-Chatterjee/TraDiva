import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Resilient fallback for build-time compilation without active env variables
const connectionString = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock";

const client = neon(connectionString);
export const db = drizzle({ client, schema });
