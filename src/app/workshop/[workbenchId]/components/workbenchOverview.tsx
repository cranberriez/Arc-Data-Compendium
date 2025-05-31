"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Workbench } from "@/types/items/workbench";
import { useItems } from "@/contexts/itemContext";
import { Badge } from "@/components/ui/badge";
import { Swords, Shirt, Layers, ArrowRight } from "lucide-react";
import { UpgradeButtons } from "./upgradeButtons";
import ItemCard from "@/components/items/ItemCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WorkbenchOverviewProps {
	workbench: Workbench;
	currentTier: number;
	link?: string;
}

export function WorkbenchOverview({ workbench, currentTier, link }: WorkbenchOverviewProps) {
	const { getItemById } = useItems();
	const maxTier = Math.max(...workbench.tiers.map((t) => t.tier));
	const progressPercentage = (currentTier / maxTier) * 100;
	const nextTier = workbench.tiers.find((t) => t.tier > currentTier);

	// Get icon component
	const getIconComponent = (iconName: string) => {
		switch (iconName) {
			case "Swords":
				return <Swords className="h-8 w-8 text-white" />;
			case "Shirt":
				return <Shirt className="h-8 w-8 text-white" />;
			default:
				return <Layers className="h-8 w-8 text-white" />;
		}
	};

	// Simulated handlers for upgrade/downgrade - these would be implemented with real logic
	const handleUpgrade = () => {
		console.log("Upgrading workbench");
		// This would handle the actual upgrade logic in a real implementation
	};

	const handleDowngrade = () => {
		console.log("Downgrading workbench");
		// This would handle the actual downgrade logic in a real implementation
	};

	return (
		<Card>
			<CardHeader className="p-2 sm:p-6">
				<div className="flex items-start min-w-full gap-4">
					<div className="rounded-lg bg-blue-500 p-3">
						{getIconComponent(workbench.icon)}
					</div>
					<div className="flex-1">
						<CardTitle className="text-2xl">{workbench.name}</CardTitle>
						<CardDescription className="text-base">
							{workbench.description}
						</CardDescription>
					</div>
					{link && (
						<Link href={link}>
							<Button
								variant="outline"
								size="sm"
							>
								Go to Workbench
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</Link>
					)}
				</div>
			</CardHeader>
			<CardContent className="p-2 sm:p-6">
				<div className="grid grid-cols-[1fr] lg:grid-cols-[3fr_1fr] gap-6">
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Tier Progress</span>
							<span className="text-sm text-muted-foreground">
								{currentTier} / {maxTier}
							</span>
						</div>
						<Progress
							value={progressPercentage}
							className="h-3"
						/>

						<UpgradeButtons
							currentTier={currentTier}
							maxTier={maxTier}
							onUpgrade={handleUpgrade}
							onDowngrade={handleDowngrade}
						/>
					</div>

					{nextTier && (
						<div className="hidden lg:block">
							<h4 className="text-sm font-medium mb-2">Next Tier Requirements</h4>
							<div className="flex flex-col gap-2">
								{nextTier.requiredItems.map((item) => {
									const itemData = getItemById(item.itemId);

									return (
										<div
											key={item.itemId}
											className="flex items-center gap-2"
										>
											<ItemCard
												item={itemData}
												variant="icon"
												size="sm"
												className="border-0 opacity-60 hover:opacity-100 transition-opacity"
											/>
											<span className="text-sm">
												{itemData?.name || item.itemId.replace(/_/g, " ")}
											</span>
											<Badge
												variant="secondary"
												className="bg-blue-500 text-white text-xs"
											>
												{item.count}x
											</Badge>
										</div>
									);
								})}
								{nextTier.raidsRequired && (
									<Badge className="mt-1 bg-blue-600 text-white w-fit">
										{nextTier.raidsRequired} raids required
									</Badge>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Mobile view for next tier requirements */}
				{nextTier && (
					<div className="lg:hidden rounded-lg mt-6 bg-muted p-3">
						<h4 className="text-sm font-medium mb-2">Next Tier Requirements</h4>
						<div className="flex flex-wrap gap-2">
							{nextTier.requiredItems.map((item) => (
								<Badge
									key={item.itemId}
									variant="outline"
								>
									{item.count}x {item.itemId.replace(/_/g, " ")}
								</Badge>
							))}
							{nextTier.raidsRequired && (
								<Badge className="bg-blue-600 text-white">
									{nextTier.raidsRequired} raids
								</Badge>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
