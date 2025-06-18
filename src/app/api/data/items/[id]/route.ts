import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { getItemSources } from "@/db/utils/getSources";

export const revalidate = 30;

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		// Fetch all items and all requiredItem relations
		const result = await db.query.items.findFirst({
			where: (items, { eq }) => eq(items.id, params.id),
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
		const cleaned = result
			? {
					...result,
					weapon: result.weapon ?? undefined,
					weaponStats: result.weaponStats ?? undefined,
					upgrades: result.upgrades ?? undefined,
					recycling: result.recycling?.io ?? undefined,
					recyclingSources: await getItemSources(result.id),
			  }
			: null;

		return NextResponse.json(cleaned, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
