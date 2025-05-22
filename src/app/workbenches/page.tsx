"use client";

import { useRef } from "react";
import { WorkbenchDisplay } from "@/components/workbench/workbenchDisplay";
import { workbenches } from "@/data/workbenches/workbenchHandler";
import { useItems } from "@/contexts/itemContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

function WorkbenchList() {
	const { getItemById } = useItems();
	const mobile = useIsMobile();
	const workbenchRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const scrollToWorkbench = (id: string) => {
		workbenchRefs.current[id]?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	return (
		<main className="flex relative">
			<nav
				className={cn(
					"flex flex-col w-48 gap-4 p-4 sticky top-0 r-0 h-full overflow-hidden",
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

			<ScrollArea
				className="h-full flex flex-col gap-x-6 gap-y-24 min-h-full w-full py-8 px-4 max-w-[1600px] scroll-smooth border-l"
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
							<WorkbenchDisplay
								workbench={workbench}
								getItemById={getItemById}
							/>
						</div>
					);
				})}
			</ScrollArea>
		</main>
	);
}

function WorkbenchesPage() {
	return <WorkbenchList />;
}

export default WorkbenchesPage;
