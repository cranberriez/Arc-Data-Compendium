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
		id?: string;
	}>;
};

const typeToQuery: Record<DataType, (options: { id?: string }) => Promise<any>> = {
	items: getItems,
	weapons: getWeapons,
	recipes: getRecipes,
	workbenches: getWorkbenches,
	quests: getQuests,
};

export const revalidate = 43200; // seconds (12 hours)

export async function GET(request: Request, { params }: RouteParams) {
	const { type, id } = await params;

	const queryFn = typeToQuery[type];

	if (!queryFn) {
		return NextResponse.json({ error: `Invalid data type: ${type}` }, { headers, status: 400 });
	}

	try {
		let response = await queryFn({ id });

		// If the query function returned an array (most Drizzle findMany calls do),
		// unwrap the first element so the client receives a single object.
		if (Array.isArray(response)) {
			response = response[0] ?? null;
		}

		if (!response) {
			return NextResponse.json(
				{ error: `${type} with id ${id} not found` },
				{ headers, status: 404 }
			);
		}

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
