import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

type ItemTagProps = {
	label: string;
	icon?: LucideIcon;
	colorClass?: string; // Tailwind background class for badge
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export const ItemTag: React.FC<ItemTagProps> = ({
	label,
	icon,
	colorClass,
	className,
	size = "md",
}) => (
	<TooltipProvider>
		<div className={cn("flex items-center justify-center rounded", colorClass, className)}>
			<Tooltip delayDuration={150}>
				<TooltipTrigger asChild>
					<div
						className="flex items-center justify-center"
						aria-label={label}
					>
						{icon &&
							React.createElement(icon, {
								className: cn(
									"w-4 h-4",
									size === "lg" && "w-4 h-4",
									size === "xl" && "w-5 h-5"
								),
								strokeWidth: 2,
							})}
					</div>
				</TooltipTrigger>
				<TooltipContent
					side="bottom"
					align="center"
				>
					<span>{label}</span>
				</TooltipContent>
			</Tooltip>
		</div>
	</TooltipProvider>
);
