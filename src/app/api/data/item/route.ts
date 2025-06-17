import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { items } from "@/db/schema/items";

export async function GET() {
	try {
		const allItems = await db.select().from(items);
		return NextResponse.json(allItems, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
