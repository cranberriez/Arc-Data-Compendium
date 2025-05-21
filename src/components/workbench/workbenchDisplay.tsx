import { Workbench } from "@/types/items/workbench";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Item } from "@/types";
import { ItemCard } from "../items/itemDisplay";
import { useDialog } from "@/contexts/dialogContext";

interface WorkbenchDisplayProps {
	workbench: Workbench;
	items: Item[];
	getItemById: (id: string) => Item | undefined;
}

const startsWithBadge = (baseTier: number) => {
	if (baseTier === 1)
		return (
			<Badge
				variant="outline"
				className="text-sm bg-green-500 dark:bg-green-700 border-green-500 dark:border-green-700"
			>
				Unlocked
			</Badge>
		);
	return (
		<Badge
			variant="outline"
			className="text-sm bg-red-400 dark:bg-red-700 border-red-400 dark:border-red-700"
		>
			Starts Locked
		</Badge>
	);
};

export function WorkbenchDisplay({ workbench, items, getItemById }: WorkbenchDisplayProps) {
	const { openDialog } = useDialog();

	return (
		<div>
			<div className="flex flex-col gap-2">
				<h2 className="text-3xl font-bold tracking-tight">{workbench.name}</h2>
				<div className="flex items-center gap-3">
					{startsWithBadge(workbench.baseTier)}
					<Badge
						variant="secondary"
						className="text-sm"
					>
						{workbench.tiers.length + workbench.baseTier} Tier
						{workbench.tiers.length + workbench.baseTier !== 1 ? "s" : ""}
					</Badge>
				</div>
			</div>

			<Separator className="my-4" />

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
				{/* Left Column - Tiers and Requirements */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">Tiers & Requirements</h3>
					<div className="space-y-4">
						{workbench.tiers.map((tier) => (
							<Card key={tier.tier}>
								<CardHeader className="pb-3">
									<div className="flex items-center justify-between">
										<CardTitle className="text-2xl">Tier {tier.tier}</CardTitle>
										{tier.raidsRequired !== undefined && (
											<span className="text-sm dark:text-orange-500 text-orange-700 rounded px-2 py-1">
												{tier.raidsRequired} raid
												{tier.raidsRequired !== 1 ? "s" : ""} required
											</span>
										)}
									</div>
								</CardHeader>

								<CardContent className="pt-0">
									{tier.requiredItems.length > 0 ? (
										<ul className="flex flex-wrap gap-2">
											{tier.requiredItems.map((item) => {
												const itemData = getItemById(item.itemId);
												if (!itemData) {
													return (
														<div
															key={item.itemId}
															className="flex flex-col h-[90px] aspect-square items-center gap-1 p-2 border-2 border-red-500 rounded-md bg-muted/50 cursor-pointer"
														>
															<div className="flex items-center gap-1">
																<div className="w-8 h-8 bg-red-500/30 border-red-500 border-2 rounded" />
																<span className="text-lg font-mono text-center">
																	x{item.count}
																</span>
															</div>
															<span className="text-xs text-muted-foreground truncate w-full text-center">
																{item.itemId}
															</span>
														</div>
													);
												}
												return (
													<ItemCard
														key={item.itemId}
														variant="icon"
														item={itemData}
														count={item.count}
														onClick={() => {
															openDialog("item", itemData);
														}}
													/>
												);
											})}
										</ul>
									) : (
										<p className="text-sm text-muted-foreground">
											No items required
										</p>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Right Column - Empty for now */}
				<div className="space-y-4">
					<h3 className="text-xl font-semibold">Recipes</h3>
					<Card>
						<CardContent className="pt-6 text-muted-foreground text-center">
							<p>Additional details will be displayed here</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
