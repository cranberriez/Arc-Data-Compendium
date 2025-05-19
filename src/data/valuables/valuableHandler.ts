import { BaseItem } from "@/types/items/base";
import { valuablesData } from "./valuableData";

// processValuables
const processedValuables = valuablesData.map((item: BaseItem) => ({
	...item,
}));

export const valuables: BaseItem[] = processedValuables;
