import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";

export const revalidate = 3600; // revalidate every hour

export async function GET() {
	try {
		// Fetch all items and all requiredItem relations
		const result = await db.query.items.findMany({
			with: {
				weapon: true,
				weaponStats: true,
				upgrades: {
					with: {
						stats: true,
					},
				},
				recycling: true,
				sources: true,
			},
		});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
