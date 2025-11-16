import { Item, Recipe, RecipeItemBase } from "@/types";

export type InputItem = Item & {
	qty: number;
};

export const inputValueCalculator = (inputs: InputItem[]) => {
	const totalValue = inputs.reduce((acc, input) => {
		return acc + input.qty * input.value;
	}, 0);
	return totalValue;
};

export const buildInputItemsArray = (
	recipe: Recipe,
	getItemById: (id: string) => Item | undefined
): InputItem[] => {
	const inputs: RecipeItemBase[] = recipe.io.filter((item) => item.role === "input");
	const inputItems: Record<string, InputItem> = inputs.reduce((acc, item) => {
		const inputItem = getItemById(item.itemId);
		if (!inputItem) return acc;
		acc[inputItem.id] = { ...inputItem, qty: item.qty };
		return acc;
	}, {} as Record<string, InputItem>);
	return Object.values(inputItems);
};

export const buildInputItemsMap = (
	recipe: Recipe,
	getItemById: (id: string) => Item | undefined
): Record<string, InputItem> => {
	const inputs: RecipeItemBase[] = recipe.io.filter((item) => item.role === "input");
	return inputs.reduce((acc, item) => {
		const inputItem = getItemById(item.itemId);
		if (!inputItem) return acc;
		acc[inputItem.id] = { ...inputItem, qty: item.qty };
		return acc;
	}, {} as Record<string, InputItem>);
};
