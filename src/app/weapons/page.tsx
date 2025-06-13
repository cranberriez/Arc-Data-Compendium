import { fetchWeapons } from "@/services/dataService";
import { WeaponsClient } from "./components/weaponClient";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Weapons | ARC Vault",
	description:
		"Weapons page listing all weapons with the ability to view their stats, TTK calculations, and more.",
};

export default async function WeaponsPage() {
	const weapons = await fetchWeapons();
	return <WeaponsClient weapons={weapons} />;
}
