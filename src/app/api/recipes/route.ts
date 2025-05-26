import { NextResponse } from "next/server";
import recipeJson from "@/data/recipes/recipeData.json";

export async function GET() {
	try {
		// Return the recipes data as JSON
		return NextResponse.json(recipeJson);
	} catch (error) {
		console.error("Error serving recipes data:", error);
		return NextResponse.json({ error: "Failed to load recipes data" }, { status: 500 });
	}
}
