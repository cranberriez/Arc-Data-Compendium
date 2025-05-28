import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkbenchesPage() {
	return (
		<main className="flex relative">
			<h1 className="sr-only">Workbenches</h1>
			{/* Navigation Skeleton */}
			<nav
				className="flex flex-col w-48 gap-4 p-4 sticky top-0 r-0 h-full overflow-hidden"
				aria-label="Workbench navigation"
			>
				{Array(5)
					.fill(0)
					.map((_, i) => (
						<Skeleton
							key={i}
							className="h-6 w-full rounded-md"
						/>
					))}
			</nav>

			{/* Main Content Skeleton */}
			<ScrollArea
				className="h-full flex flex-col gap-x-6 gap-y-24 min-h-full w-full py-8 px-4 max-w-[1600px] scroll-smooth border-l"
				role="region"
				aria-label="Workbenches list"
			>
				<div className="space-y-6">
					{/* Workbench Header */}
					<div className="space-y-4">
						<Skeleton className="h-8 w-1/3 rounded-md" />
						<div className="flex gap-2">
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-16 rounded-full" />
						</div>
					</div>

					{/* Workbench Content */}
					<div className="space-y-2">
						<Skeleton className="h-6 w-1/4 rounded-md" />
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
							{Array(5)
								.fill(0)
								.map((_, i) => (
									<Skeleton
										key={i}
										className="h-32 rounded-md"
									/>
								))}
						</div>
					</div>
				</div>
			</ScrollArea>
		</main>
	);
}
