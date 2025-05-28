"use client";

import { useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Workbench } from "@/types/index";
import { WorkbenchDisplay } from "./workbenchDisplay";
import { WorkbenchTierContainer } from "./wbTierCard";

type WorkbenchClientProps = {
	workbenches: Workbench[];
};

export function WorkbenchClient({ workbenches }: WorkbenchClientProps) {
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
								<WorkbenchDisplay workbench={workbench}>
									<WorkbenchTierContainer workbench={workbench} />
								</WorkbenchDisplay>
							</div>
						);
					})}
				</ScrollArea>
			</div>
		</main>
	);
}
