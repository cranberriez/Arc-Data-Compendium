import { Item } from "@/types";
import { valuablesData } from "./valuableData";

// processValuables
const processedValuables = valuablesData.map((item) => ({
	...item,
}));

export const valuables: Item[] = processedValuables;
