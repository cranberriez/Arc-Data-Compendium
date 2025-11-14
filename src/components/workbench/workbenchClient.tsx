"use client";

import React from "react";
import { Card } from "@/components/ui/card";

import { ItemCategory, Workbench } from "@/types";
import getItemIcon from "@/components/items/getItemIcon";
import WorkbenchTiers from "./workbenchTiers";
import { useWorkbenchLevels } from "@/hooks/useUser";
import { makeGridBgStyle } from "@/utils/gridByStyle";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/useData";
import { formatName } from "@/utils/format";
import { useProfitableRecipes } from "@/hooks/useProfit";
import { ArrowLeft, ArrowRight, Book, Coins, Package, PencilRuler } from "lucide-react";
import ItemCard from "../items/ItemCard";
import { Button } from "../ui/button";

const workbenchColors: Record<
	string,
	{ bg: string; shadow: string; border: string; gradient: string; iconColor: string }
> = {
	refiner: {
		bg: "bg-blue-400 dark:bg-blue-500",
		shadow: "rgba(255, 255, 255, 0.2)",
		gradient: "bg-gradient-to-r from-blue-500/20 to-transparent",
		border: "border-blue-400 dark:border-blue-500",
		iconColor: "text-blue-700 dark:text-blue-300",
	},
	default: {
		bg: "bg-blue-200 dark:bg-blue-800",
		shadow: "rgba(255, 255, 255, 0.2)",
		gradient: "bg-gradient-to-r from-blue-200/20 to-transparent",
		border: "border-blue-200 dark:border-blue-800",
		iconColor: "text-blue-700 dark:text-blue-300",
	},
};

const collectWorkbenchOutputItems = (workbench: Workbench) => {
	const items = new Set<string>();
	workbench.workbenchRecipes.forEach((wbRecipe) => {
		wbRecipe.recipe.io.forEach((io) => {
			if (io.role === "output") {
				items.add(io.itemId);
			}
		});
	});
	return Array.from(items);
};

interface WorkbenchClientProps {
	workbench: Workbench;
}

export function WorkbenchClient({ workbench }: WorkbenchClientProps) {
	if (!workbench) return null;
	const { getItemById } = useItems();

	const { getWorkbenchLevel, setWorkbenchLevel, hasHydrated } = useWorkbenchLevels();
	const storedLevel = hasHydrated ? getWorkbenchLevel(workbench.id) : null;

	// Calculate derived values
	const curWbTier = storedLevel ?? workbench.baseTier;

	const isMaxed = curWbTier === workbench.tiers.length;
	const icon = getItemIcon(workbench.icon, "w-full h-full");

	const upgradeWorkbench = () => {
		setWorkbenchLevel(workbench.id, curWbTier + 1);
	};

	const downgradeWorkbench = () => {
		setWorkbenchLevel(workbench.id, curWbTier - 1);
	};

	let wbIdForColors = "default";
	if (workbench.id in workbenchColors) {
		wbIdForColors = workbench.id;
	}

	const outputItemIds = collectWorkbenchOutputItems(workbench);
	const outputItems = outputItemIds.map((id) => getItemById(id));
	const outputCategories = new Set(outputItems.map((item) => item?.category));

	return (
		<div className="space-y-6">
			<Card
				className={`p-0 flex flex-wrap flex-row justify-between w-full border-2 ${workbenchColors[wbIdForColors].border}`}
				style={makeGridBgStyle({
					gap: "3rem",
					line: "1px",
					color: "rgba(50, 50, 50, 0.3)",
				})}
			>
				<div className="flex flex-col justify-between	 w-full">
					<div
						className={cn(
							"flex flex-col justify-between p-2 sm:p-6",
							workbenchColors[wbIdForColors].gradient,
							"border-b",
							workbenchColors[wbIdForColors].border
						)}
					>
						<div className="flex flex-col gap-2">
							<WorkbenchHeader
								title={workbench.name}
								id={wbIdForColors}
								icon={icon}
								categories={outputCategories}
								workbench={workbench}
							/>
						</div>
					</div>
					<WorkbenchUpgradeRequirements
						workbench={workbench}
						curWbTier={curWbTier}
						upgradeWorkbench={upgradeWorkbench}
						downgradeWorkbench={downgradeWorkbench}
					/>
				</div>
			</Card>

			<WorkbenchTiers
				workbenchId={workbench.id}
				recipes={workbench.workbenchRecipes}
				tiers={workbench.tiers}
				curWbTier={curWbTier}
			/>
		</div>
	);
}

function WorkbenchHeader({
	title,
	id,
	icon,
	categories,
	workbench,
}: {
	title: string;
	id: string;
	icon: React.ReactNode;
	categories: Set<ItemCategory | undefined>;
	workbench: Workbench;
}) {
	const profitableRecipes = useProfitableRecipes(workbench.workbenchRecipes.map((r) => r.recipe));

	return (
		<div className="flex flex-wrap items-start gap-4">
			<div
				className={cn(
					"flex-shrink-0 text-card rounded-lg p-3 w-16 h-16 -rotate-5 shadow-lg",
					workbenchColors[id].bg
				)}
				style={{ boxShadow: `0px 0px 8px ${workbenchColors[id].shadow}` }}
			>
				{icon}
			</div>
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-extrabold">{title}</h1>
				<div className="flex flex-wrap gap-2">
					{Array.from(categories).map(
						(category) => category && <CategoryTag key={category} category={category} />
					)}
				</div>
			</div>
			<div className="flex md:ml-auto">
				<WorkbenchSummary
					numRecipes={workbench.workbenchRecipes.length}
					numProfitable={profitableRecipes.length}
					numBlueprints={
						workbench.workbenchRecipes.filter(
							(recipe) => recipe.recipe.isBlueprintLocked
						).length
					}
				/>
			</div>
		</div>
	);
}

function WorkbenchSummary({
	numRecipes,
	numProfitable,
	numBlueprints,
}: {
	numRecipes: number;
	numProfitable: number;
	numBlueprints: number;
}) {
	return (
		<div className="flex gap-2 p-2 rounded-lg border bg-card/50">
			<div className="flex flex-col items-center justify-center">
				<p className="flex items-center gap-1">
					<Book size={16} className="text-orange-700 dark:text-orange-300" />
					{numRecipes}
				</p>
				<p className="text-xs text-muted-foreground">Recipes</p>
			</div>
			<div className="text-muted-foreground/30">|</div>
			<div className="flex flex-col items-center justify-center">
				<p className="flex items-center gap-1">
					<Coins size={16} className="text-green-700 dark:text-green-300" />
					{numProfitable}
				</p>
				<p className="text-xs text-muted-foreground">Profitable</p>
			</div>
			<div className="text-muted-foreground/30">|</div>
			<div className="flex flex-col items-center justify-center">
				<p className="flex items-center gap-1">
					<PencilRuler size={16} className="text-blue-700 dark:text-blue-300" />
					{numBlueprints}
				</p>
				<p className="text-xs text-muted-foreground">Blueprints</p>
			</div>
		</div>
	);
}

function CategoryTag({ category }: { category: ItemCategory }) {
	return (
		<span className="text-xs font-semibold text-primary/90 bg-card/50 px-2 py-0.5 rounded-full border whitespace-nowrap">
			{formatName(category)}s
		</span>
	);
}

function WorkbenchUpgradeRequirements({
	workbench,
	curWbTier,
	upgradeWorkbench,
	downgradeWorkbench,
}: {
	workbench: Workbench;
	curWbTier: number;
	upgradeWorkbench: () => void;
	downgradeWorkbench: () => void;
}) {
	const { getItemById } = useItems();
	const upgradeTier = curWbTier < workbench.tiers.length ? workbench.tiers[curWbTier] : null;
	const requirements = upgradeTier?.requirements || [];

	return (
		<div className="flex justify-start gap-4 p-2 sm:p-6">
			<div className="flex flex-col items-center border rounded-lg gap-5 p-4">
				<p className="text-xs text-muted-foreground tracking-widest font-semibold uppercase">
					Station Level
				</p>
				<div className="flex items-center justify-between gap-6 p-2">
					<Button
						onClick={downgradeWorkbench}
						disabled={curWbTier === 0}
						size="lg"
						variant="ghost"
						className="cursor-pointer"
					>
						<ArrowLeft size={16} />
					</Button>
					<p className="text-4xl font-bold">{curWbTier}</p>
					<Button
						onClick={upgradeWorkbench}
						disabled={curWbTier === workbench.tiers.length}
						size="lg"
						variant="ghost"
						className="cursor-pointer"
					>
						<ArrowRight size={16} />
					</Button>
				</div>
			</div>
			<div className="w-full flex flex-col gap-4">
				{requirements.length > 0 ? (
					<>
						<p className="flex items-center gap-2 text-lg font-semibold">
							<Package
								size={18}
								className={workbenchColors[workbench.id].iconColor}
							/>
							Upgrade Requirements
						</p>
						<div className="flex flex-wrap gap-4">
							{requirements.map((requirement) => {
								const item = getItemById(requirement.itemId);
								if (!item) return null;

								return (
									<div
										className="flex items-center gap-2 border rounded-lg p-2 bg-card/50"
										key={requirement.itemId}
									>
										<p className="font-bold text-2xl w-16 text-center">
											{requirement.count}
										</p>
										<ItemCard
											item={item}
											size="md"
											className="border-0 md:min-w-[250px]"
										/>
									</div>
								);
							})}
						</div>
					</>
				) : (
					<div className="flex-1 h-full flex items-center justify-center border dark:border-green-400 border-green-500 border-dashed bg-card/50 rounded-lg">
						<span className="text-green-700 dark:text-green-200 font-semibold text-xl">
							This Workbench is Max Level
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
