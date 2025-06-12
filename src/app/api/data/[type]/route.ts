import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
	url: process.env.UPSTASH_STORAGE_KV_REST_API_URL!,
	token: process.env.UPSTASH_STORAGE_KV_REST_API_TOKEN!,
});

type DataType = "items" | "recipes" | "workbenches" | "quests";

const typeToPrefix: Record<DataType, string> = {
	items: "item",
	recipes: "recipe",
	workbenches: "workbench",
	quests: "quest",
};

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type RouteParams = {
	params: Promise<{
		type: DataType;
	}>;
};

export const revalidate = 3600; // seconds

export async function GET(request: Request, { params }: RouteParams) {
	try {
		const { type } = await params;
		const prefix = typeToPrefix[type as DataType];
		if (!prefix) {
			return NextResponse.json(
				{ error: `Invalid data type: ${type}` },
				{ headers, status: 400 }
			);
		}

		// Scan for all keys of this type
		let cursor = 0;
		let allKeys: string[] = [];
		do {
			const [nextCursor, keys] = await redis.scan(cursor, {
				match: `${prefix}:*`,
				count: 1000,
			});
			allKeys = allKeys.concat(keys as string[]);
			cursor = Number(nextCursor);
		} while (cursor !== 0);

		if (allKeys.length === 0) {
			return NextResponse.json([], { headers });
		}

		const values = await redis.mget(...allKeys);
		const parsed = values.map((v) => (typeof v === "string" ? JSON.parse(v) : v));

		return NextResponse.json(parsed, { headers });
	} catch (error) {
		console.error(`Error fetching data:`, error);
		return NextResponse.json({ error: "Internal server error" }, { headers, status: 500 });
	}
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
	return new Response(null, {
		headers,
	});
}
