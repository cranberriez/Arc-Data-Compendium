// app/dashboard/page.tsx
import { fetchItems } from "@/services/dataService";
import { Swords, Hammer, Recycle, Shield, Package, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/items/itemDisplay";
import { QuickLink } from "./_components/quickLink";
import { StatCard } from "./_components/statCard";

const DEBUG_DAYS_FORWARD = 0;

// Server component that fetches and processes data
export default async function DashboardPage() {
	const items = await fetchItems();

	// Calculate stats on the server
	const stats = {
		totalItems: items.length,
		weapons: items.filter((item) => item.category === "weapon").length,
		equipment: items.filter((item) => ["gear", "ammunition"].includes(item.category)).length,
		valuables: items.filter((item) => item.category === "valuable").length,
	};

	// Generate recent items on the server
	const today = new Date();
	today.setDate(today.getDate() + DEBUG_DAYS_FORWARD);
	const dateString = today.toISOString().split("T")[0];
	const seed = dateString.split("-").reduce((acc, val) => acc + parseInt(val), 0);

	// Simple seeded random function
	const createSeededRandom = (seed: number) => {
		let s = seed;
		return () => {
			s = Math.sin(s) * 10000;
			return s - Math.floor(s);
		};
	};

	// Get 4 items based on today's seed
	const random = createSeededRandom(seed);
	const recentItems = [...items].sort(() => 0.5 - random()).slice(0, 4);

	return (
		<div className="container mx-auto p-4 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight sr-only">Dashboard</h1>
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Items"
					value={stats.totalItems}
					icon={Package}
					color="text-blue-500"
				/>
				<StatCard
					title="Weapons"
					value={stats.weapons}
					icon={Swords}
					color="text-red-500"
				/>
				<StatCard
					title="Equipment"
					value={stats.equipment}
					icon={Shield}
					color="text-green-500"
				/>
				<StatCard
					title="Valuables"
					value={stats.valuables}
					icon={Zap}
					color="text-yellow-500"
				/>
			</div>

			{/* Quick Links */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<h2 className="text-xl font-semibold col-span-full">Quick Access</h2>
				<QuickLink
					title="Recycling"
					description="Find recycling values"
					icon={Recycle}
					href="/recycling"
					color="bg-blue-500"
				/>
				<QuickLink
					title="Weapons"
					description="Browse all available weapons"
					icon={Swords}
					href="/weapons"
					color="bg-red-500"
				/>
				<QuickLink
					title="Equipment"
					description="Explore defensive gear"
					icon={Shield}
					href="/equipment"
					color="bg-green-500"
				/>
				<QuickLink
					title="Crafting"
					description="View crafting recipes"
					icon={Hammer}
					href="/crafting"
					color="bg-amber-500"
				/>
			</div>

			{/* Recent Items */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Today&apos;s Random Items</h2>
					<Button
						variant="ghost"
						className="text-primary"
						asChild
					>
						<Link href="/items">View All</Link>
					</Button>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{recentItems.map((item) => (
						<ItemCard
							key={item.id}
							item={item}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
