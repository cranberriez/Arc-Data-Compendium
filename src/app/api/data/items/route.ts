import { NextResponse } from "next/server";
import { getItems } from "@/db/queries";

export const revalidate = 30;

export async function GET() {
	try {
		// Use the generalized getItems function to fetch all items
		const items = await getItems();

		return NextResponse.json(items, { status: 200 });
	} catch (error) {
		console.error("Error fetching items:", error);
		return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
	}
}
