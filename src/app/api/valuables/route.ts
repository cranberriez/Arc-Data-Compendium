import { NextResponse } from "next/server";
import valuableJson from "@/data/valuables/valuableData.json";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
	try {
		// Return the valuables data as JSON
		return NextResponse.json(valuableJson, {
			headers,
			status: 200,
		});
	} catch (error) {
		console.error("Error serving valuables data:", error);
		return NextResponse.json(
			{ error: "Failed to load valuables data" },
			{
				headers,
				status: 500,
			}
		);
	}
}
