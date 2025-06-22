import { Item } from "@/types";
import {
	Anvil,
	Cog,
	Heart,
	Info,
	LucideIcon as LucideIconType,
	MapPin,
	Package,
	Shield,
	Sword,
	Trophy,
	Wrench,
	Zap,
} from "lucide-react";

import { Rarity } from "@/types";

const rarityClasses = {
	common: {
		border: "border-common",
		text: "text-common",
		bg: "bg-common",
	},
	uncommon: {
		border: "border-uncommon",
		text: "text-uncommon",
		bg: "bg-uncommon",
	},
	rare: {
		border: "border-rare",
		text: "text-rare",
		bg: "bg-rare",
	},
	epic: {
		border: "border-epic",
		text: "text-epic",
		bg: "bg-epic",
	},
	legendary: {
		border: "border-legendary",
		text: "text-legendary",
		bg: "bg-legendary",
	},
};

export const getRarityColor = (rarity: string, type: "border" | "text" | "bg"): string => {
	const normalizedRarity = rarity.toLowerCase() as Rarity;
	const validRarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
	const safeRarity = validRarities.includes(normalizedRarity) ? normalizedRarity : "common";
	return rarityClasses[safeRarity][type];
};

export const getTypeIcon = (category: string): LucideIconType => {
	switch (category.toLowerCase()) {
		case "quick_use":
			return Zap;
		case "weapon":
			return Sword;
		case "gear":
			return Shield;
		case "trinket":
			return Trophy;
		case "consumable":
			return Heart;
		case "recyclable":
			return Wrench;
		case "base_material":
			return Cog;
		case "misc":
			return Package;
		case "topside_material":
			return MapPin;
		case "refined_material":
			return Anvil;
		default:
			return Info;
	}
};

export const formatName = (type: string) => {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const formatCamelName = (type: string) => {
	return type.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
};

export const formatValue = (value: number) => {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

export const searchFunc = (item: Item, query: string) => {
	// Helper: normalize and tokenize
	const normalize = (str: string) =>
		str
			.toLowerCase()
			.replace(/[_\s]+/g, " ") // treat underscores and spaces the same
			.replace(/[^a-z0-9 ]/g, "") // remove non-alphanum except space
			.trim();

	const queryNorm = normalize(query);
	if (!queryNorm) return false;

	const queryTokens = queryNorm.split(" ").filter(Boolean);

	// Prepare name and id tokens
	const nameTokens = normalize(item.name ?? "")
		.split(" ")
		.filter(Boolean);
	const idTokens = normalize(item.id ?? "")
		.split(" ")
		.filter(Boolean);

	// Also prepare compact versions (remove all spaces and underscores)
	const compact = (str: string) =>
		str
			.toLowerCase()
			.replace(/[_\s]+/g, "")
			.replace(/[^a-z0-9]/g, "");
	const compactQuery = compact(query);
	const compactName = compact(item.name ?? "");
	const compactId = compact(item.id ?? "");

	// Match if every query token is found in either name or id tokens,
	// or if the compact query is a substring of the compact name or id
	return (
		queryTokens.every(
			(qt) =>
				nameTokens.some((nt) => nt.includes(qt)) || idTokens.some((it) => it.includes(qt))
		) ||
		(compactQuery.length > 0 &&
			(compactName.includes(compactQuery) || compactId.includes(compactQuery)))
	);
};
