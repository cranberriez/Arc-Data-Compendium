import { fetchItems } from "@/services/dataService.server";
import { StoreProvider } from "@/stores/StoreProvider";
import Test from "./components/test.componet";

export default async function TestPage() {
	// Fetch all data server-side for pre-rendering
	const [initialItems] = await Promise.all([fetchItems()]);

	return (
		<StoreProvider
			initialData={{ items: initialItems, recipes: [], quests: [], workbenches: [] }}
		>
			<Test />
		</StoreProvider>
	);
}
