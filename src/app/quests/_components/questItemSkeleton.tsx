import { Skeleton } from "@/components/ui/skeleton";

export function QuestItemSkeleton() {
	return (
		<li className="flex gap-2">
			<div className="flex flex-col flex-1 gap-4 border rounded-lg p-4 shadow">
				<div className="flex md:flex-row flex-col gap-8">
					{/* Header Skeleton */}
					<div className="flex flex-col flex-1 gap-2">
						<Skeleton className="h-6 w-1/2 mb-1" /> {/* Quest Title */}
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-8 rounded-full" /> {/* Trader icon */}
							<Skeleton className="h-4 w-24" /> {/* Trader name */}
						</div>
						<Skeleton className="h-4 w-32" /> {/* Location */}
						<Skeleton className="h-4 w-3/4" /> {/* Dialog */}
					</div>

					{/* Requirements Skeleton */}
					<div className="flex-1">
						<Skeleton className="h-4 w-24 mb-2" /> {/* Requirements label */}
						<div className="flex flex-col gap-2 ml-6">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>

					{/* Rewards Skeleton */}
					<div className="flex-1">
						<Skeleton className="h-4 w-20 mb-2" /> {/* Rewards label */}
						<div className="flex flex-col gap-2 ml-6">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
				</div>
				{/* Buttons Skeleton */}
				<div className="flex flex-row gap-2">
					<Skeleton className="h-8 w-20 rounded-md" />
					<Skeleton className="h-8 w-16 rounded-md" />
					<Skeleton className="h-8 w-16 rounded-md" />
				</div>
			</div>
		</li>
	);
}

export default QuestItemSkeleton;
