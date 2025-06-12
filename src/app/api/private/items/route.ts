import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// Redis client using Upstash env variables from .sample.env
// Redis client using Upstash env variables (see .sample.env)
const redis = new Redis({
	url: process.env.UPSTASH_STORAGE_KV_REST_API_URL!,
	token: process.env.UPSTASH_STORAGE_KV_REST_API_TOKEN!,
});

export const POST = async (req: NextRequest) => {
	// Clerk Auth: Ensure user is authenticated
	const { userId } = getAuth(req);
	if (!userId) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	// Fetch user and check for admin role in privateMetadata
	const user = await currentUser();
	if (!user || user.privateMetadata?.role !== "admin") {
		return new NextResponse("Forbidden", { status: 403 });
	}

	// Parse JSON body (supports legacy and new bulk format)
	let parsed;
	try {
		parsed = await req.json();
	} catch {
		return new NextResponse("Invalid JSON", { status: 400 });
	}

	let prefix = "item";
	let items: any[] = [];
	if (parsed && typeof parsed === "object" && parsed.data && parsed.prefix) {
		// Bulk upload: { prefix, data }
		prefix = parsed.prefix;
		items = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
	} else {
		// Legacy: single or batch item(s)
		items = Array.isArray(parsed) ? parsed : [parsed];
	}

	// Validate all items have an id
	if (!items.every((item) => item && typeof item.id === "string")) {
		return new NextResponse("Each item must have an 'id' string", { status: 400 });
	}

	// Save to Redis (as JSON string per item key), adding created/updated timestamps
	try {
		const now = new Date().toISOString();
		if (items.length === 1) {
			// Single item: use SET
			const item = items[0];
			const key = `${prefix}:${item.id}`;
			const existing = await redis.get(key);
			let created = now;
			if (existing) {
				try {
					const parsed = typeof existing === "string" ? JSON.parse(existing) : existing;
					if (parsed.created) created = parsed.created;
				} catch {}
			}
			const withTimestamps = { ...item, created, updated: now };
			await redis.set(key, JSON.stringify(withTimestamps));
			return new NextResponse(JSON.stringify({ success: true, count: 1 }), { status: 200 });
		} else {
			// Batch: use MSET (optimized with MGET)
			// 'now' is already defined in the outer scope: const now = new Date().toISOString();
			const keys = items.map((item) => `${prefix}:${item.id}`);
			const msetArgs: string[] = [];

			if (items.length > 0) {
				// Fetch all potentially existing records in one go
				const existingRecordsRaw = await redis.mget(...keys);

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const key = keys[i]; // Use pre-computed key from the keys array
					const existingRaw = existingRecordsRaw[i]; // This can be null if key didn't exist
					let created = now; // Default to 'now' (from outer scope)

					if (existingRaw) {
						// Check if data was actually returned for this key
						try {
							const parsedExisting =
								typeof existingRaw === "string"
									? JSON.parse(existingRaw)
									: existingRaw;
							// Ensure parsedExisting is an object and has 'created' property before using it
							if (
								parsedExisting &&
								typeof parsedExisting === "object" &&
								parsedExisting.created
							) {
								created = parsedExisting.created;
							}
						} catch (e) {
							console.error(
								`Error parsing existing item JSON for key ${key}: ${
									e instanceof Error ? e.message : String(e)
								}`
							);
							// Fallback: 'created' remains 'now'. Or handle error as per requirements.
						}
					}
					const withTimestamps = { ...item, created, updated: now };
					msetArgs.push(key, JSON.stringify(withTimestamps));
				}

				if (msetArgs.length > 0) {
					// @ts-ignore: upstash/redis types allow passing ...args for MSET
					await redis.mset(...msetArgs);
				}
			}
			return new NextResponse(JSON.stringify({ success: true, count: items.length }), {
				status: 200,
			});
		}
	} catch {
		return new NextResponse("Failed to save items to Redis", { status: 500 });
	}
};
