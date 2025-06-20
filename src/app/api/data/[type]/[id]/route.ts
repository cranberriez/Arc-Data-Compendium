import { NextResponse } from "next/server";
import { Item } from "@/types/items/item";
import { Recipe } from "@/types/items/recipe";
import { Workbench } from "@/types/items/workbench";
import { Quest } from "@/types/items/quest";

// Import all JSON data files
import itemData from "@/data/items/itemData.build.json";
import recipeData from "@/data/recipes/recipeData.json";
import workbenchData from "@/data/workbenches/workbenchData.json";
import questData from "@/data/quests/questData.json";

type DataType = "items" | "recipes" | "workbenches" | "quests";

// Map data types to their corresponding data sources
const dataMap: Record<DataType, any> = {
	items: itemData as Item[],
	recipes: recipeData as Recipe[],
	workbenches: workbenchData as Workbench[],
	quests: questData as Quest[],
};

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type RouteParams = {
	params: Promise<{
		type: DataType;
		id: string;
	}>;
};

export async function GET(request: Request, { params }: RouteParams) {
	try {
		const { type, id } = await params;
		const data = dataMap[type];

		if (!data) {
			return NextResponse.json(
				{ error: `Invalid data type: ${type}` },
				{ headers, status: 400 }
			);
		}

		const item = data.find((item: any) => item.id === id);
		if (!item) {
			return NextResponse.json(
				{ error: `${type.slice(0, -1)} not found` },
				{ headers, status: 404 }
			);
		}

		return NextResponse.json(item, { headers });
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
