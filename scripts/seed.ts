import { seedItems } from "./seedItems";
import { seedQuests } from "./seedQuests";
import { seedWorkbenches } from "./seedWorkbenches";

export async function seed() {
	await seedItems();
	await seedQuests();
	await seedWorkbenches();
}

seed();
