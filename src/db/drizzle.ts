import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env.local" });

export const db = drizzle(process.env.NEON_STORAGE_POSTGRES_URL!, {
	schema,
});
