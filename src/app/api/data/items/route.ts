import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { getItemSources } from "@/db/utils/getSources";

// DISABLED FOR DEV TEST
// export const revalidate = 3600; // revalidate every hour

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
				recycling: {
					with: {
						io: true,
					},
				},
			},
		});

		// For each item, fetch recipeItems where itemId matches and role === 'output'
		const cleaned = await Promise.all(
			result.map(async ({ weapon, weaponStats, upgrades, recycling, ...base }: any) => {
				const recyclingSources = await getItemSources(base.id);
				return {
					...base,
					...(weapon && { weapon }),
					...(weaponStats && { weaponStats }),
					...(upgrades?.length && { upgrades }),
					...(recycling?.io && { recycling: recycling.io }),
					...(recyclingSources && { recyclingSources }),
				};
			})
		);

		return NextResponse.json(cleaned, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
