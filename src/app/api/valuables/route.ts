import { NextResponse } from "next/server";
import valuableJson from "@/data/valuables/valuableData.json";

export async function GET() {
	try {
		// Return the valuables data as JSON
		return NextResponse.json(valuableJson);
	} catch (error) {
		console.error("Error serving valuables data:", error);
		return NextResponse.json({ error: "Failed to load valuables data" }, { status: 500 });
	}
}
