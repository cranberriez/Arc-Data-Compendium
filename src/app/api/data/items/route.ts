import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { items, requiredItem } from "@/db/schema/items";

export async function GET() {
	try {
		// Fetch all items and all requiredItem relations
		const [allItems, allRequiredItems] = await Promise.all([
			db.select().from(items),
			db.select().from(requiredItem),
		]);

		const itemsWithRelations = allItems.map((item) => {
			// Recycling: inputs that can be recycled to produce this item
			const recycling = allRequiredItems
				.filter((r) => r.consumerType === "recycle" && r.consumerId === item.id)
				.map((r) => ({ item_id: r.itemId, count: r.count }));

			// Sources: where this item is used as input
			// Fix up later, context handles this at the moment
			// const sources = allRequiredItems
			// 	.filter((r) => r.itemId === item.id)
			// 	.map((r) => ({
			// 		consumer_type: r.consumerType,
			// 		consumer_id: r.consumerId,
			// 		count: r.count,
			// 	}));

			return {
				...item,
				recycling,
				// sources,
			};
		});

		return NextResponse.json(itemsWithRelations, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
