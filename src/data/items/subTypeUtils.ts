import { Item, Weapon } from "@/types";

export function isWeapon(item: Item): item is Weapon {
	return item.category === "weapon";
}
