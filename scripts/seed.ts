import { seedItems } from "./seedItems";
import { seedQuests } from "./seedQuests";
import { seedWorkbenches } from "./seedWorkbenches";
import { seedRecipes } from "./seedRecipes";

export async function seed() {
	await seedItems();
	const missingItems = await seedQuests();
	await seedWorkbenches();
	await seedRecipes();

	console.log("Missing items refernced by quests:", missingItems);
	return;
}

seed();
