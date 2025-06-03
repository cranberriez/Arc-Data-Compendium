import { Item } from "@/types";
import { RecycleIcon, Book, LucideIcon, Boxes } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import React from "react";

export type DescriptorBadgeData = {
	key: string;
	label: string;
	icon?: LucideIcon;
	color?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export function getDescriptorBadges(item: Item): DescriptorBadgeData[] {
	const badges: DescriptorBadgeData[] = [];

	if (item.recycling && item.recycling.length > 0) {
		badges.push({
			key: "recyclable",
			label: "Recyclable",
			icon: RecycleIcon,
			color: "#34d399",
		});
	}
	if (item.recipeId) {
		badges.push({
			key: "craftable",
			label: "Craftable",
			icon: Book,
			color: "#60a5fa",
		});
	}
	if (item.sources && item.sources.length > 0) {
		badges.push({
			key: "sources",
			label: "Sources",
			icon: Boxes,
			color: "#f59e0b",
		});
	}

	// if (item.upgradeUsage) {
	// 	badges.push({
	// 		key: "upgrade",
	// 		label: "Used in Upgrade",
	// 		icon: <UpgradeIcon />,
	// 		color: "#a78bfa",
	// 	});
	// }
	// if (item.questUsage) {
	// 	badges.push({
	// 		key: "quest",
	// 		label: "Quest Item",
	// 		icon: <QuestIcon />,
	// 		color: "#fbbf24",
	// 	});
	// }

	// Add more badge checks as needed

	return badges;
}

type DescriptorBadgeProps = {
	label: string;
	icon?: LucideIcon;
	color?: string;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export const DescriptorBadge: React.FC<DescriptorBadgeProps> = ({
	label,
	icon,
	color,
	className,
	size = "md",
}) => (
	<TooltipProvider>
		<div
			className={cn("", className)}
			style={{ color }}
		>
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
								strokeWidth: 3,
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
