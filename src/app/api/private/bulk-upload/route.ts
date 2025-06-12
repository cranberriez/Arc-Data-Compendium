import { NextResponse } from "next/server";
import { getAuth, currentUser } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

// Static data (server-side import avoids sending large JSON to the client)
import itemsData from "@/data/items/itemData.build.json";
import workbenchesData from "@/data/workbenches/workbenchData.json";
import questsData from "@/data/quests/questData.json";

const redis = new Redis({
	url: process.env.UPSTASH_STORAGE_KV_REST_API_URL!,
	token: process.env.UPSTASH_STORAGE_KV_REST_API_TOKEN!,
});

// Helper to upload an array of objects to Redis with prefix+id as key
async function bulkUploadToRedis(data: any[], prefix: string, now: string) {
	for (const obj of data) {
		if (!obj.id) continue;
		const key = `${prefix}:${obj.id}`;
		await redis.set(key, {
			...obj,
			createdAt: now,
			updatedAt: now,
		});
	}
}

export async function POST(req: NextRequest) {
	// Optionally: auth check could be added here
	try {
		// You may customize these prefixes as needed
		const itemPrefix = "item";
		const workbenchPrefix = "workbench";
		const questPrefix = "quest";

		const now = new Date().toISOString();
		await bulkUploadToRedis(itemsData, itemPrefix, now);
		await bulkUploadToRedis(workbenchesData, workbenchPrefix, now);
		await bulkUploadToRedis(questsData, questPrefix, now);

		return NextResponse.json({ success: true, message: "Bulk upload completed." });
	} catch (err: any) {
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}
