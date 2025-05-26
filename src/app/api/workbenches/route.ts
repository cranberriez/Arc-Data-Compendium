import { NextResponse } from "next/server";
import workbenchJson from "@/data/workbenches/workbenchData.json";

export async function GET() {
	try {
		// Return the workbenches data as JSON
		return NextResponse.json(workbenchJson);
	} catch (error) {
		console.error("Error serving workbenches data:", error);
		return NextResponse.json({ error: "Failed to load workbenches data" }, { status: 500 });
	}
}
