import { fetchWorkbenchById } from "@/services/dataService";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	ArrowLeft,
	Info,
	Layers,
	Swords,
	Shirt,
	ChevronUp,
	ChevronDown,
	Lock,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Define a theme color that works well in both dark and light modes
// Using blue as the theme color for workbenches
const themeColor = {
	primary: "blue-500",
	secondary: "blue-600",
	light: "blue-400",
	dark: "blue-600",
	bg: "blue-500/10",
	border: "blue-500/30",
};

interface WorkbenchPageProps {
	params: Promise<{
		workbenchId: string;
	}>;
}

export default async function WorkbenchPage({ params }: WorkbenchPageProps) {
	// Note: This is a server component, so we're using "use client" directives in nested client components
	// For demo purposes, we'll create placeholder state and UI interactions
	const { workbenchId } = await params;

	// Fetch workbench data based on the workbench param
	const workbench = await fetchWorkbenchById(workbenchId);
	if (!workbench) {
		// Handle not found case
		return (
			<div className="container mx-auto px-4 py-8 relative">
				{/* Theme color background effect */}
				<div
					className={`absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-${themeColor.bg} to-transparent -z-10 opacity-50`}
				></div>
				<div className="flex items-center space-x-2 mb-8">
					<Link href="/workshop">
						<Button
							variant="outline"
							size="sm"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Workshop
						</Button>
					</Link>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Workbench not found</CardTitle>
						<CardDescription>
							The requested workbench could not be found.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	// Get current tier and next tier
	const currentTier = workbench.baseTier;
	const maxTier = Math.max(...workbench.tiers.map((t) => t.tier));
	const nextTier = workbench.tiers.find((t) => t.tier > currentTier);

	// Sort tiers by tier number
	const sortedTiers = [...workbench.tiers].sort((a, b) => a.tier - b.tier);

	// Calculate progress percentage for tier progress bar
	const tierProgressPercentage = (currentTier / maxTier) * 100;

	// Create placeholder recipes for each tier
	const tierRecipes = sortedTiers.map((tier) => ({
		tier: tier.tier,
		recipes: [
			...Array(3 + tier.tier)
				.fill(0)
				.map((_, i) => ({
					id: `recipe-${tier.tier}-${i}`,
					name: `Tier ${tier.tier} Item ${i + 1}`,
					description: `A craftable item from tier ${tier.tier}`,
					materials: [
						{ itemId: "material_1", count: 2 * tier.tier },
						{ itemId: "material_2", count: tier.tier },
					],
					unlocked: tier.tier <= currentTier,
				})),
		],
	}));

	// Flatten recipes for display
	const allRecipes = tierRecipes.flatMap((t) => t.recipes);
	const availableRecipes = allRecipes.filter((r) => r.unlocked);
	const lockedRecipes = allRecipes.filter((r) => !r.unlocked);

	// Icon mapping - you can expand this with actual icons
	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "Swords":
				return <Swords className={`h-6 w-6 text-blue-500`} />;
			case "Shirt":
				return <Shirt className={`h-6 w-6 text-blue-500`} />;
			default:
				return <Layers className={`h-6 w-6 text-blue-500`} />;
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Back button and header */}
			<div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center mb-6">
				<div className="flex items-center space-x-2">
					<Link href="/workshop">
						<Button
							variant="outline"
							size="sm"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Workshop
						</Button>
					</Link>
				</div>
				<div className="flex items-center space-x-2">
					<Badge
						variant="outline"
						className={`text-sm border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold`}
					>
						Tier {currentTier}
					</Badge>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
								>
									<Info className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Workbench information and upgrade requirements</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Main workbench card */}
			<Card className="mb-8">
				<CardHeader className="flex flex-row items-center gap-4">
					<div className={`p-3 rounded-lg bg-blue-500/10 border border-blue-500/30`}>
						{getIcon(workbench.icon)}
					</div>
					<div>
						<CardTitle className="text-2xl">{workbench.name}</CardTitle>
						<CardDescription>{workbench.description}</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col space-y-4">
						{/* Current tier status */}
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">Current Tier</span>
							<Badge className={`bg-blue-500 hover:bg-blue-600`}>
								<span className="font-bold">{currentTier}</span>
							</Badge>
						</div>

						{/* Overall tier progress */}
						<div className="space-y-2 mt-4">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Workbench Progress</span>
								<span className="text-xs">
									{currentTier} / {maxTier}
								</span>
							</div>
							<Progress
								value={tierProgressPercentage}
								className="h-2"
							/>
						</div>

						{/* Downgrade button */}
						{currentTier > 1 && (
							<Button
								variant="outline"
								className="ml-auto"
							>
								<ChevronDown className="mr-2 h-4 w-4" />
								Downgrade to Tier {currentTier - 1}
							</Button>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Tier requirements tabs */}
			<Card className={`mb-8 border-blue-500/30 shadow-md`}>
				<CardHeader>
					<CardTitle>Workbench Tiers</CardTitle>
					<CardDescription>Upgrade requirements for each tier</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						defaultValue={`tier-${currentTier}`}
						className="w-full"
					>
						<div className="flex items-center gap-4 mb-4">
							<TabsList className="flex flex-row">
								{sortedTiers.map((tier) => (
									<TabsTrigger
										key={tier.tier}
										value={`tier-${tier.tier}`}
									>
										<div className="flex items-center gap-2">
											<span>Tier {tier.tier}</span>
											{tier.tier === currentTier && (
												<Badge
													className={`h-5 px-1 bg-blue-500 text-white font-bold`}
												>
													Current
												</Badge>
											)}
										</div>
									</TabsTrigger>
								))}
							</TabsList>
							{nextTier && (
								<div className="flex items-center gap-2">
									<Button
										className={`bg-blue-500 hover:bg-blue-600 text-white`}
										disabled={!nextTier}
									>
										<ChevronUp className="mr-2 h-4 w-4" />
										Upgrade to Tier {nextTier.tier}
									</Button>
									{nextTier.raidsRequired && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													Requires {nextTier.raidsRequired} raids to
													unlock
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</div>
							)}
						</div>

						{sortedTiers.map((tier) => (
							<TabsContent
								key={tier.tier}
								value={`tier-${tier.tier}`}
								className="space-y-4"
							>
								<div className="space-y-4">
									{tier.raidsRequired && (
										<div className="flex items-center justify-start gap-2 mb-4">
											<Badge
												variant="outline"
												className="bg-secondary/10"
											>
												<AlertCircle className="h-3 w-3 mr-1" />
												{tier.raidsRequired} Raids Required
											</Badge>
										</div>
									)}

									<Separator className="my-4" />

									<div className="space-y-4">
										<div>
											<h3 className="text-sm font-medium mb-3">
												Required Items
											</h3>

											{tier.requiredItems.length > 0 ? (
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
													{tier.requiredItems.map((item, index) => (
														<div
															key={index}
															className={`flex flex-col items-center space-y-2 p-2 hover:bg-blue-500/10 rounded-md transition-colors border border-transparent hover:border-blue-500/30`}
														>
															<ItemIconSkeleton size="default" />
															<div className="text-center">
																<p className="text-sm font-medium capitalize">
																	{item.itemId.replace(/_/g, " ")}
																</p>
																<Badge className={`bg-blue-500/80`}>
																	{item.count}
																</Badge>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-4 text-muted-foreground">
													No items required for this tier
												</div>
											)}
										</div>

										{/* Recipes for this tier */}
										<Separator className="my-6" />

										<div className="space-y-4">
											<h3 className="text-sm font-medium flex items-center">
												<span>Recipes</span>
												<Badge
													variant="outline"
													className="ml-2"
												>
													Tier {tier.tier}
												</Badge>
											</h3>

											{/* Available recipes */}
											{tier.tier <= currentTier ? (
												<div>
													<div className="flex items-center gap-2 mb-3">
														<Badge className={`bg-blue-500/80`}>
															<CheckCircle className="h-3 w-3 mr-1" />
															Available
														</Badge>
													</div>

													<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
														{tierRecipes
															.find((r) => r.tier === tier.tier)
															?.recipes.filter(
																(recipe) => recipe.unlocked
															)
															.map((recipe, index) => (
																<div
																	key={index}
																	className={`flex flex-col space-y-2 p-3 hover:bg-blue-500/10 rounded-md transition-colors cursor-pointer border border-transparent hover:border-blue-500/30`}
																>
																	<div className="flex items-start gap-3">
																		<ItemIconSkeleton size="sm" />
																		<div>
																			<p className="text-sm font-medium">
																				{recipe.name}
																			</p>
																			<p className="text-xs text-muted-foreground">
																				{recipe.description}
																			</p>
																		</div>
																	</div>
																	<div className="flex flex-wrap gap-2 mt-2">
																		{recipe.materials.map(
																			(mat, idx) => (
																				<Badge
																					key={idx}
																					variant="outline"
																					className="text-xs"
																				>
																					{mat.itemId.replace(
																						/_/g,
																						" "
																					)}{" "}
																					x{mat.count}
																				</Badge>
																			)
																		)}
																	</div>
																</div>
															))}
													</div>
												</div>
											) : (
												<div>
													<div className="flex items-center gap-2 mb-3">
														<Badge
															variant="outline"
															className="bg-secondary/10"
														>
															<Lock className="h-3 w-3 mr-1" />
															Locked
														</Badge>
													</div>

													<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
														{tierRecipes
															.find((r) => r.tier === tier.tier)
															?.recipes.map((recipe, index) => (
																<div
																	key={index}
																	className="flex flex-col space-y-2 p-3 bg-secondary/5 rounded-md opacity-70"
																>
																	<div className="flex items-start gap-3">
																		<ItemIconSkeleton size="sm" />
																		<div>
																			<div className="flex items-center gap-1">
																				<p className="text-sm font-medium">
																					{recipe.name}
																				</p>
																				<Lock className="h-3 w-3" />
																			</div>
																			<p className="text-xs text-muted-foreground">
																				Unlocks at Tier{" "}
																				{tier.tier}
																			</p>
																		</div>
																	</div>
																</div>
															))}
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>

			{/* Crafting section */}
			<Card className={`border-blue-500/30 shadow-md`}>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<span>Available Crafting</span>
							<Badge className={`bg-blue-500 text-white`}>Tier {currentTier}</Badge>
						</CardTitle>
						<CardDescription>Items you can craft at this workbench</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Available recipes section */}
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Badge className={`bg-blue-500/80`}>
									<CheckCircle className="h-3 w-3 mr-1" />
									Available Recipes
								</Badge>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
								{availableRecipes.map((recipe, index) => (
									<div
										key={index}
										className={`flex flex-col space-y-2 group cursor-pointer hover:bg-blue-500/10 p-3 rounded-md transition-colors border border-transparent hover:border-blue-500/30`}
									>
										<ItemIconSkeleton size="default" />
										<div className="text-center">
											<p className="text-sm font-medium">{recipe.name}</p>
											<div className="flex items-center justify-center gap-1 mt-1">
												<Badge className={`text-xs bg-blue-500/80`}>
													Tier {recipe.name.split(" ")[1]}
												</Badge>
											</div>
										</div>
										<Button
											size="sm"
											className={`mt-2 bg-blue-500 hover:bg-blue-600 w-full`}
										>
											Craft
										</Button>
									</div>
								))}
							</div>
						</div>

						{/* Locked recipes section */}
						<Separator className="my-6" />

						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className="bg-secondary/10"
								>
									<Lock className="h-3 w-3 mr-1" />
									Locked Recipes
								</Badge>
							</div>

							<div className="grid grid-cols-1 gap-4">
								{/* Group locked recipes by tier */}
								{sortedTiers
									.filter((tier) => tier.tier > currentTier)
									.map((tier) => (
										<div
											key={tier.tier}
											className="space-y-3"
										>
											<h4 className="text-sm font-medium flex items-center">
												<Lock className="h-3 w-3 mr-1" />
												<span>Tier {tier.tier} Recipes</span>
												<Badge
													variant="outline"
													className="ml-2 text-xs"
												>
													Upgrade Required
												</Badge>
											</h4>

											<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
												{tierRecipes
													.find((r) => r.tier === tier.tier)
													?.recipes.map((recipe, index) => (
														<div
															key={index}
															className="flex flex-col space-y-2 p-3 bg-secondary/5 rounded-md opacity-70"
														>
															<ItemIconSkeleton size="default" />
															<div className="text-center">
																<div className="flex items-center justify-center gap-1">
																	<p className="text-sm font-medium">
																		{recipe.name}
																	</p>
																	<Lock className="h-3 w-3" />
																</div>
																<p className="text-xs text-muted-foreground">
																	Unlocks at Tier {tier.tier}
																</p>
															</div>
														</div>
													))}
											</div>
										</div>
									))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
