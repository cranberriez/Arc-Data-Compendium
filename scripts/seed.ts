import { seedItems } from "./seedItems";
import { seedQuests } from "./seedQuests";

export async function seed() {
	await seedItems();
	await seedQuests();
}

seed();
