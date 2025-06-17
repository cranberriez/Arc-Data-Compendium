import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { Weapon } from "@/types";

// DISABLED FOR DEV TEST
// export const revalidate = 3600; // revalidate every hour

export async function GET() {
	try {
		// Fetch all items and all requiredItem relations
		const result = await db.query.items.findMany({
			where: (items, { eq }) => eq(items.category, "weapon"),
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

		const cleaned = result.map(
			({ weapon, weaponStats, upgrades, recycling, ...base }: any) => ({
				...base,
				...(weapon && { weapon }),
				...(weaponStats && { weaponStats }),
				...(upgrades?.length && { upgrades }),
				...(recycling?.io && { recycling: recycling.io }),
			})
		);

		return NextResponse.json(cleaned, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
