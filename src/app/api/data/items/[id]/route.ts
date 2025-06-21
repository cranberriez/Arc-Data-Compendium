import { NextResponse } from "next/server";
import { getItems } from "@/db/queries";

export const revalidate = 30;

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		// Use the generalized getItems function to fetch a specific item by ID
		const item = await getItems({ id: params.id });

		return NextResponse.json(item, { status: 200 });
	} catch (error) {
		console.error("Error fetching item:", error);
		return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
	}
}
