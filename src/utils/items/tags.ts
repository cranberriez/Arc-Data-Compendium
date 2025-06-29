import { Item } from "@/types";
import { RecycleIcon, Book, LucideIcon, Boxes, ShoppingBasket, Hammer, Scroll } from "lucide-react";

export type ItemTagData = {
	key: string;
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	size?: "sm" | "md" | "lg" | "xl";
};

export function getItemTags(item: Item): ItemTagData[] {
	const tags: ItemTagData[] = [];

	// Only consider an item to be used for a quest if its use is "objective" not "reward"
	const isQuestObjective = item.questEntries?.some(
		(entry) => entry.questEntry.type === "objective"
	);

	const questUses = !!isQuestObjective;
	const workbenchUses = !!item.workbenchRequirements?.length;

	const sources: { type: string }[] = []; // add item.sources when its implemented
	const hasRecipe = !!item.recipeId; // add item.recycling when its implemented
	const hasRecycling = !!item.recyclingId; // add item.recycling when its implemented

	// Quest use
	if (questUses) {
		tags.push({
			key: "use-quest",
			label: "Quest",
			icon: Scroll,
			colorClass: "text-purple-800 dark:text-purple-200",
		});
	}

	// Workbench use
	if (workbenchUses) {
		tags.push({
			key: "use-workbench",
			label: "Workbench Upgrade",
			icon: Hammer,
			colorClass: "text-lime-800 dark:text-lime-200",
		});
	}

	if (hasRecycling) {
		tags.push({
			key: "recyclable",
			label: "Recyclable",
			icon: RecycleIcon,
			colorClass: "text-green-800 dark:text-green-200",
		});
	}

	if (hasRecipe) {
		tags.push({
			key: "craftable",
			label: "Craftable",
			icon: Book,
			colorClass: "text-blue-800 dark:text-blue-200",
		});
	}

	if (sources.length > 0) {
		// Badge for recycle sources
		if (sources.some((src) => src.type === "recycle")) {
			tags.push({
				key: "sources-recycle",
				label: "Has Recycle Source",
				icon: Boxes,
				colorClass: "text-emerald-800 dark:text-emerald-200",
			});
		}
		// Badge for buy sources
		if (sources.some((src) => src.type === "buy")) {
			tags.push({
				key: "sources-buy",
				label: "Purchaseable",
				icon: ShoppingBasket,
				colorClass: "text-amber-800 dark:text-amber-200",
			});
		}
	}

	return tags;
}
