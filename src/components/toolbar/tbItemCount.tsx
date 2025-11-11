import { useItems } from "@/hooks/useData";
import { useIsPageName } from "@/hooks/use-pagename";
import { cn } from "@/lib/utils";

export default function ToolbarItemCount({
	initialCount,
	className,
}: {
	initialCount: number;
	className?: string;
}) {
	const { items } = useItems();
	const onItemsPage = useIsPageName("items");
	const areItemsFiltered = items.length !== initialCount;

	return onItemsPage && areItemsFiltered ? (
		<>
			<p className={cn("text-sm text-muted-foreground hidden sm:inline", className)}>
				Viewing {items.length} of {initialCount} items
			</p>
			<p className={cn("text-sm text-muted-foreground inline sm:hidden", className)}>
				{items.length} of {initialCount}
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
