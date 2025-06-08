import { Skeleton } from "@/components/ui/skeleton";

export default function QuestFullSkeleton() {
	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-4 mx-auto max-w-[1200px]">
				{/* Back button skeleton */}
				<div className="w-32 h-8 mb-2">
					<Skeleton className="w-full h-full rounded-md" />
				</div>

				{/* Top image skeleton */}
				<div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
					<Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
				</div>

				{/* Title and subtitle skeleton */}
				<Skeleton className="h-8 w-1/2 mb-2" />
				<Skeleton className="h-4 w-40 mb-6" />

				<div className="flex flex-col md:flex-row gap-8">
					{/* Main content skeleton */}
					<div className="flex-1">
						{/* Dialog section */}
						<div className="mb-6">
							<Skeleton className="h-6 w-28 mb-2" />
							<Skeleton className="h-16 w-full rounded" />
						</div>
						{/* Objectives section */}
						<div className="mb-6">
							<Skeleton className="h-6 w-32 mb-2" />
							<div className="flex flex-col gap-2 ml-6">
								<Skeleton className="h-4 w-1/2" />
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-1/4" />
							</div>
						</div>
						{/* Rewards section */}
						<div>
							<Skeleton className="h-6 w-24 mb-2" />
							<div className="flex flex-col gap-2 ml-6">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-4 w-1/4" />
							</div>
						</div>
					</div>

					{/* Sidebar skeleton */}
					<aside className="w-full md:w-64 flex-shrink-0">
						<div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow mb-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-8 w-40 mt-2" />
						</div>
						<Skeleton className="h-8 w-32 mt-4" />
					</aside>
				</div>
			</div>
		</article>
	);
}
