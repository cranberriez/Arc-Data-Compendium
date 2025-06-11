import { fetchWeapons } from "@/services/dataService";
import { WeaponsClient } from "./components/weaponClient";

export default async function WeaponsPage() {
	const weapons = await fetchWeapons();
	return <WeaponsClient weapons={weapons} />;
}
