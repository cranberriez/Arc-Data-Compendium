import { Item } from "@/types";

const rarityOrder = {
	common: 1,
	uncommon: 2,
	rare: 3,
	epic: 4,
	legendary: 5,
};

export const sortByRarityThenName =
	() =>
	(a: Item, b: Item): number => {
		const rarityCompare = rarityOrder[a.rarity] - rarityOrder[b.rarity];
		if (rarityCompare !== 0) return rarityCompare;
		return a.name.localeCompare(b.name);
	};

export const sortItems = (
	items: Item[],
	sortField: string,
	sortOrder: "asc" | "desc" | "none"
): Item[] => {
	if (sortField === "none" || sortField === "rarity" || sortOrder === "none") {
		return [...items].sort(sortByRarityThenName());
	}

	return [...items].sort((a, b) => {
		let aValue: any, bValue: any;

		if (sortField === "name") {
			aValue = a.name.toLowerCase();
			bValue = b.name.toLowerCase();
		} else if (sortField === "category") {
			aValue = a.category;
			bValue = b.category;
		} else {
			aValue = a[sortField as keyof Item];
			bValue = b[sortField as keyof Item];
		}

		if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
		if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
		return 0;
	});
};
