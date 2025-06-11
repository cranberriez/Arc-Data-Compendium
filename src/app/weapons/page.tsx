import { fetchWeapons } from "@/services/dataService";

export default async function WeaponsPage() {
	const weapons = await fetchWeapons();

	return (
		<div>
			{weapons.map((weapon) => (
				<div key={weapon.id}>{weapon.name}</div>
			))}
		</div>
	);
}
