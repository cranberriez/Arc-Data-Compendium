import { NextResponse } from "next/server";
import { getItems, getWeapons, getRecipes, getWorkbenches, getQuests } from "@/db/queries";

type DataType = "items" | "weapons" | "recipes" | "workbenches" | "quests";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type RouteParams = {
	params: Promise<{
		type: DataType;
	}>;
};

const typeToQuery: Record<DataType, () => Promise<any>> = {
	items: getItems,
	weapons: getWeapons,
	recipes: getRecipes,
	workbenches: getWorkbenches,
	quests: getQuests,
};

export const revalidate = 43200; // seconds (12 hours)

export async function GET(request: Request, { params }: RouteParams) {
	const { type } = await params;

	const queryFn = typeToQuery[type];

	if (!queryFn) {
		return NextResponse.json({ error: `Invalid data type: ${type}` }, { headers, status: 400 });
	}

	try {
		const response = await queryFn();

		return NextResponse.json(response, { headers });
	} catch (error) {
		console.error(`Error fetching data:`, error);
		return NextResponse.json({ error: "Internal server error" }, { headers, status: 500 });
	}
}

// Handle OPTIONS method for CORS preflight
export async function OPTIONS() {
	return new Response(null, {
		headers,
	});
}
