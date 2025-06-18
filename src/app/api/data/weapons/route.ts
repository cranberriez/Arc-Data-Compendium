import { NextResponse } from "next/server";
import { getItems } from "@/lib/data/items";

export const revalidate = 30;

export async function GET() {
	try {
		// Use the generalized getItems function to fetch all weapons
		const weapons = await getItems({ category: "weapon" });
		
		return NextResponse.json(weapons, { status: 200 });
	} catch (error) {
		console.error("Error fetching weapons:", error);
		return NextResponse.json({ error: "Failed to fetch weapons" }, { status: 500 });
	}
}
