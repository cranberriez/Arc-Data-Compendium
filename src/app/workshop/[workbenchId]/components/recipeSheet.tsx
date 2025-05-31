"use client";

import { X, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetClose,
} from "@/components/ui/sheet";
import { ItemIconSkeleton } from "@/components/items/itemIconSkeleton";

export interface RecipeMaterial {
	itemId: string;
	name?: string;
	count: number;
}

export interface Recipe {
	id: string;
	name: string;
	description: string;
	materials: RecipeMaterial[];
	unlockTier: number;
	unlocked: boolean;
}

interface RecipeSheetProps {
	selectedRecipe: Recipe | null;
	onOpenChange: (open: boolean) => void;
}

export function RecipeSheet({ selectedRecipe, onOpenChange }: RecipeSheetProps) {
	return (
		<Sheet
			open={!!selectedRecipe}
			onOpenChange={(open) => !open && onOpenChange(false)}
		>
			<SheetContent className="w-2/3 sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Recipe Details</SheetTitle>
					<SheetDescription>View complete recipe information</SheetDescription>
				</SheetHeader>
				{selectedRecipe && (
					<div className="mt-6 px-4 sm:px-6 space-y-6">
						<div className="flex items-start gap-4">
							<ItemIconSkeleton size="lg" />
							<div>
								<h3 className="text-xl font-semibold">{selectedRecipe.name}</h3>
								<p className="text-muted-foreground">
									{selectedRecipe.description}
								</p>
								<div className="mt-2 flex items-center gap-2">
									<Badge
										className={
											selectedRecipe.unlocked ? "bg-blue-500 text-white" : ""
										}
									>
										{selectedRecipe.unlocked ? "Available" : "Locked"}
									</Badge>
									<Badge variant="outline">
										Tier {selectedRecipe.unlockTier}
									</Badge>
								</div>
							</div>
						</div>

						<Separator />

						<div>
							<h4 className="text-lg font-medium mb-3">Required Materials</h4>
							<div className="grid gap-3">
								{selectedRecipe.materials.map((material) => (
									<div
										key={material.itemId}
										className="flex items-center gap-3 rounded-lg border p-3"
									>
										<ItemIconSkeleton size="default" />
										<div className="flex-1">
											<p className="font-medium">
												{material.name ||
													material.itemId.replace(/_/g, " ")}
											</p>
											<div className="flex items-center justify-between">
												<Badge
													variant="secondary"
													className="text-xs bg-blue-500 text-white"
												>
													{material.count}x required
												</Badge>
												<Badge
													variant="outline"
													className="text-xs"
												>
													0 available
												</Badge>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<Separator />

						<div className="space-y-3">
							<h4 className="text-lg font-medium">Crafting</h4>
							{!selectedRecipe.unlocked ? (
								<div className="rounded-lg border bg-muted/30 p-4">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Lock className="h-4 w-4" />
										<p>
											Upgrade to Tier {selectedRecipe.unlockTier} to unlock
											this recipe
										</p>
									</div>
								</div>
							) : (
								<Button className="w-full bg-blue-600 hover:bg-blue-700">
									Craft {selectedRecipe.name}
								</Button>
							)}
						</div>
					</div>
				)}
				<SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</SheetClose>
			</SheetContent>
		</Sheet>
	);
}
