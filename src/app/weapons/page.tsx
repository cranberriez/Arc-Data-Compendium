import { fetchWeapons } from "@/services/dataService.server";
import { WeaponClient } from "./_components/weaponClient";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Weapons | ARC Vault",
	description:
		"Weapons page listing all weapons with the ability to view their stats, TTK calculations, and more.",
};

export default async function WeaponsPage() {
	const weapons = await fetchWeapons();

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
				<Suspense fallback={<div>Loading...</div>}>
					<WeaponClient weapons={weapons} />
				</Suspense>
			</div>
		</article>
	);
}
