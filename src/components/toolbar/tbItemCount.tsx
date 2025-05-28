import { useItems } from "@/contexts/itemContext";
import { useIsPageName } from "@/hooks/use-pagename";

export default function ToolbarItemCount({ initialCount }: { initialCount: number }) {
	const { filteredItems } = useItems();
	const onItemsPage = useIsPageName("items");
	const areItemsFiltered = filteredItems.length !== initialCount;

	return onItemsPage && areItemsFiltered ? (
		<p className="text-sm text-muted-foreground">
			Viewing {filteredItems.length} of {initialCount} items
		</p>
	) : (
		<p className="text-sm text-muted-foreground">Currently {initialCount} items</p>
	);
}
