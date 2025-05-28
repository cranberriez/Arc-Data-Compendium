import { NextResponse } from "next/server";
import workbenchJson from "@/data/workbenches/workbenchData.json";
import { Workbench } from "@/types/items/workbench";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type Params = {
	params: {
		id: string;
	};
};

export async function GET(request: Request, { params }: Params) {
	try {
		const { id } = params;
		const workbench = (workbenchJson as Workbench[]).find((w) => w.id === id);

		if (!workbench) {
			return NextResponse.json({ error: "Workbench not found" }, { headers, status: 404 });
		}

		return NextResponse.json(workbench, { headers, status: 200 });
	} catch (error) {
		console.error("Error serving workbench data:", error);
		return NextResponse.json(
			{ error: "Failed to load workbench data" },
			{ headers, status: 500 }
		);
	}
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
	return new NextResponse(null, {
		headers,
		status: 200,
	});
}
