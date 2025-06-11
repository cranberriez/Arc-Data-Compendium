import { Weapon } from "@/types";

export function isWeapon(item: any): item is Weapon {
	return item.sub_type === "weapon";
}
