import { useItems } from "@/contexts/itemContext";
import { useIsPageName } from "@/hooks/use-pagename";
import { cn } from "@/lib/utils";

export default function ToolbarItemCount({
	initialCount,
	className,
}: {
	initialCount: number;
	className?: string;
}) {
	const { filteredItems } = useItems();
	const onItemsPage = useIsPageName("items");
	const areItemsFiltered = filteredItems.length !== initialCount;

	return onItemsPage && areItemsFiltered ? (
		<>
			<p className={cn("text-sm text-muted-foreground hidden sm:inline", className)}>
				Viewing {filteredItems.length} of {initialCount} items
			</p>
			<p className={cn("text-sm text-muted-foreground inline sm:hidden", className)}>
				{filteredItems.length} of {initialCount}
			</p>
		</>
	) : (
		<>
			<p className={cn("text-sm text-muted-foreground hidden sm:inline", className)}>
				Currently {initialCount} items
			</p>
			<p className={cn("text-sm text-muted-foreground inline sm:hidden", className)}>
				{initialCount}
			</p>
		</>
	);
}
