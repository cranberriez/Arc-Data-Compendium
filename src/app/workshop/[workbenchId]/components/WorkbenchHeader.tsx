"use client";

import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface WorkbenchHeaderProps {
	currentTier: number;
}

export function WorkbenchHeader({ currentTier }: WorkbenchHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Link href="/workshop">
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Workshop
					</Button>
				</Link>
				<Badge
					variant="secondary"
					className="bg-blue-500 text-white"
				>
					Tier {currentTier}
				</Badge>
			</div>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
						>
							<Info className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Upgrade your workbench to unlock new recipes and capabilities</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
