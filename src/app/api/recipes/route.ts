import { NextResponse } from "next/server";
import recipeJson from "@/data/recipes/recipeData.json";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
	try {
		// Return the recipes data as JSON
		return NextResponse.json(recipeJson, {
			headers,
			status: 200,
		});
	} catch (error) {
		console.error("Error serving recipes data:", error);
		return NextResponse.json(
			{ error: "Failed to load recipes data" },
			{
				headers,
				status: 500,
			}
		);
	}
}
