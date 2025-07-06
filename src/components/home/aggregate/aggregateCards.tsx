import { cn } from "@/lib/utils";
import { Anvil, ArrowRight, Database, LucideIcon, PencilRuler, Scroll, Zap } from "lucide-react";
import Link from "next/link";

export function CountCard({
	count,
	title,
	icon: Icon,
	iconColor,
	className,
	cardLink,
}: {
	count: number;
	title: string;
	icon: LucideIcon;
	iconColor?: string;
	className?: string;
	cardLink?: string;
}) {
	return (
		<Link
			href={`${cardLink}`}
			className="flex-1 group"
		>
			<div
				className={cn(
					"flex w-full items-center justify-start gap-4 md:gap-4 p-6 bg-card rounded-lg hover:shadow-lg transition-all cursor-pointer relative",
					className
				)}
			>
				<Icon className={cn("w-8 h-8 transition-opacity duration-200", iconColor)} />
				<div>
					<h3 className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
						{title}
					</h3>
					<p className="font-bold text-3xl font-mono">{count}</p>
				</div>

				<ArrowRight
					className={cn(
						"w-8 h-8 absolute right-4 transition-opacity duration-200 opacity-60",
						iconColor
					)}
				/>
			</div>
		</Link>
	);
}

export function AggregateCards({
	itemCount = 0,
	questCount = 0,
	weaponCount = 0,
	workbenchUpgradeCount = 0,
}: {
	itemCount?: number;
	questCount?: number;
	weaponCount?: number;
	workbenchUpgradeCount?: number;
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 w-full gap-6">
			<h2 className="sr-only">Database Aggregations</h2>
			<CountCard
				count={itemCount}
				title="Total Items"
				icon={Database}
				iconColor="text-blue-400"
				className="hover:shadow-blue-500/50"
				cardLink="items"
			/>
			<CountCard
				count={weaponCount}
				title="Weapons"
				icon={Zap}
				iconColor="text-red-400"
				className="hover:shadow-red-500/50"
				cardLink="weapons"
			/>
			<CountCard
				count={questCount}
				title="Quests"
				icon={Scroll}
				iconColor="text-purple-400"
				className="hover:shadow-purple-500/50"
				cardLink="quests"
			/>
			{/* <CountCard
				count={craftingRecipeCount}
				title="Crafting Recipes"
				icon={PencilRuler}
				iconColor="text-amber-400"
				className="hover:shadow-amber-500/50"
				cardLink="recipes"
			/> */}
			<CountCard
				count={workbenchUpgradeCount}
				title="Workbench Items"
				icon={Anvil}
				iconColor="text-green-400"
				className="hover:shadow-green-500/50"
				cardLink="workshop"
			/>
		</div>
	);
}
