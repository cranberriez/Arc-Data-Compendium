import { NextResponse } from "next/server";
import workbenchJson from "@/data/workbenches/workbenchData.json";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
	try {
		// Return the workbenches data as JSON
		return NextResponse.json(workbenchJson, {
			headers,
			status: 200,
		});
	} catch (error) {
		console.error("Error serving workbenches data:", error);
		return NextResponse.json(
			{ error: "Failed to load workbenches data" },
			{
				headers,
				status: 500,
			}
		);
	}
}

// Handle OPTIONS method for CORS preflight
// This is needed for some browsers and frameworks
// that send a preflight OPTIONS request before the actual request
export async function OPTIONS() {
	return new NextResponse(null, {
		headers,
		status: 200,
	});
}
