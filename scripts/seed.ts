import { seedItems } from "./seedItems";
import { seedQuests } from "./seedQuests";
import { seedWorkbenches } from "./seedWorkbenches";
import { seedRecipes } from "./seedRecipes";

export async function seed() {
	await seedItems();
	await seedQuests();
	await seedWorkbenches();
	await seedRecipes();
}

seed();
