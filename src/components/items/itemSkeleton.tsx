import { Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

// Create a skeleton card to show during loading
export default function ItemCardSkeleton() {
	return (
		<Card className="flex flex-row items-center gap-2 p-1 pr-2 max-w-[300px] md:max-w-[400px] rounded-lg w-full h-16 bg-transparent border-zinc-700">
			{/* Item Icon Skeleton */}
			<div className="flex items-center justify-center rounded-md h-full border-2 border-secondary/30 p-2 bg-secondary/5">
				<Skeleton className="h-full aspect-square w-8" />
			</div>
			<div className="flex flex-col flex-1 w-full h-full gap-2">
				<div className="min-w-fit flex flex-1 flex-row items-center justify-between">
					<Skeleton className="h-4 w-[120px]" />
					<Skeleton className="h-4 w-4 rounded-full" />
				</div>
				<div className="min-w-fit flex flex-1 flex-row items-center gap-3">
					<Skeleton className="h-3 w-[40px]" />
					<Skeleton className="h-3 w-[40px]" />
				</div>
			</div>
		</Card>
	);
}
