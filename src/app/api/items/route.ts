import { NextResponse } from "next/server";
import itemJson from "@/data/items/itemData.json";

export async function GET() {
	try {
		// Return the items data as JSON
		return NextResponse.json(itemJson);
	} catch (error) {
		console.error("Error serving items data:", error);
		return NextResponse.json({ error: "Failed to load items data" }, { status: 500 });
	}
}
