import { fetchWeapons } from "@/services/dataService.server";
import { WeaponClient } from "./components/weaponClient";
import { Metadata } from "next";
import { Weapon } from "@/types";

export const metadata: Metadata = {
	title: "Weapons | ARC Vault",
	description:
		"Weapons page listing all weapons with the ability to view their stats, TTK calculations, and more.",
};

export default async function WeaponsPage() {
	const weapons = await fetchWeapons();

	return <WeaponClient weapons={weapons} />;
	// return <WeaponsClient weapons={weapons} />;
}
