"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRef } from "react";
import { Workbench } from "@/types";
import { Badge } from "@/components/ui/badge";

interface WorkbenchRecipesClientProps {
	workbenches: Workbench[];
}

export function WorkbenchRecipesClient({ workbenches }: WorkbenchRecipesClientProps) {
	const workbenchRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
	const mobile = false;

	const scrollToWorkbench = (id: string) => {
		workbenchRefs.current[id]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<main className="flex relative">
			<h1 className="sr-only">Workbenches</h1>
			<nav
				className={cn(
					"hidden lg:flex flex-col w-48 gap-4 p-4 fixed top-24 h-fit overflow-hidden",
					mobile && "hidden"
				)}
				aria-label="Workbench navigation"
			>
				{workbenches.map((workbench) => {
					const workbenchId = workbench.name.toLowerCase().replace(/\s+/g, "-");
					return (
						<button
							key={workbench.id}
							onClick={() => scrollToWorkbench(workbenchId)}
							className="text-sm hover:underline hover:text-primary text-left cursor-pointer"
						>
							{workbench.name}
						</button>
					);
				})}
			</nav>

			<div className="w-full h-full flex justify-center pl-0 lg:px-48">
				<ScrollArea
					className="h-full flex flex-col gap-x-6 gap-y-24 min-h-full w-full py-8 px-4 max-w-[1600px] scroll-smooth"
					role="region"
					aria-label="Workbenches list"
				>
					{workbenches.map((workbench) => {
						const workbenchId = workbench.name.toLowerCase().replace(/\s+/g, "-");
						return (
							<div
								key={workbench.id}
								ref={(el) => {
									workbenchRefs.current[workbenchId] = el;
								}}
								id={workbenchId}
								className="scroll-mt-24"
								aria-labelledby={`${workbenchId}-title`}
							>
								<h2
									id={`${workbenchId}-title`}
									className="sr-only"
								>
									{workbench.name}
								</h2>
								<div className="flex flex-col gap-2">
									<h2 className="text-3xl font-bold tracking-tight">
										{workbench.name}
									</h2>
									<div className="flex items-center gap-3">
										{/* {startsWithBadge(workbench.baseTier)} */}
										<Badge
											variant="secondary"
											className="text-sm"
										>
											{workbench.tiers.length} Tier
											{workbench.tiers.length !== 1 ? "s" : ""}
										</Badge>
									</div>
								</div>
							</div>
						);
					})}
				</ScrollArea>
			</div>
		</main>
	);
}
