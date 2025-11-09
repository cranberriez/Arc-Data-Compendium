import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import path from "path";

// Load envs when running outside Next.js (e.g. tsx scripts)
config({ path: path.resolve(process.cwd(), ".env") });
config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEON_STORAGE_POSTGRES_URL;
if (!url) {
	throw new Error(
		"NEON_STORAGE_POSTGRES_URL is not set. Create .env.local with NEON_STORAGE_POSTGRES_URL=<postgres_connection_url>."
	);
}
const sql = neon(url);
export const db = drizzle(sql, { schema });
