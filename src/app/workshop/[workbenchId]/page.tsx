import { fetchWorkbenchById } from "@/services/dataService";
import { WorkbenchClient } from "./components/WorkbenchClient";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WorkbenchPageProps {
	params: Promise<{
		workbenchId: string;
	}>;
}

export default async function WorkbenchPage({ params }: WorkbenchPageProps) {
	const { workbenchId } = await params;

	// Fetch workbench data based on the workbench param
	const workbench = await fetchWorkbenchById(workbenchId);

	// Handle not found case
	if (!workbench) {
		return (
			<div className="container mx-auto px-4 py-8 relative">
				<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent -z-10 opacity-50"></div>
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

	// Sort tiers by tier number
	const sortedTiers = [...workbench.tiers].sort((a, b) => a.tier - b.tier);

	// Create recipes for each tier with the structure expected by client components
	const recipes = sortedTiers.flatMap((tier) =>
		// Create some placeholder recipes for each tier
		Array(3 + tier.tier)
			.fill(0)
			.map((_, i) => ({
				id: `recipe-${tier.tier}-${i}`,
				name: `Tier ${tier.tier} Item ${i + 1}`,
				description: `A craftable item from tier ${tier.tier}`,
				materials: [
					{ itemId: "material_1", count: 2 * tier.tier },
					{ itemId: "material_2", count: tier.tier },
				],
				unlockTier: tier.tier,
				unlocked: tier.tier <= workbench.baseTier,
			}))
	);

	return (
		// Render the client component with the server-fetched data
		<WorkbenchClient
			workbench={workbench}
			recipes={recipes}
		/>
	);
}
