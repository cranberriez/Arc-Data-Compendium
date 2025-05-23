"use client";

import { useFilteredItems } from "@/contexts/itemContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Hammer, Recycle, Shield, Package, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ItemCard } from "@/components/items/itemDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Item } from "@/types";
import ItemSkeleton from "@/components/items/itemSkeleton";

interface StatCardProps {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	color?: string;
}

interface QuickLinkProps {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
	color?: string;
}

const DashboardPage = () => {
	const { filteredItems: items } = useFilteredItems();
	const [recentItems, setRecentItems] = useState<Item[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		totalItems: 0,
		weapons: 0,
		equipment: 0,
		valuables: 0,
	});

	useEffect(() => {
		if (items.length > 0) {
			// Calculate stats
			setStats({
				totalItems: items.length,
				weapons: items.filter((item) => item.category === "weapon").length,
				equipment: items.filter((item) => ["gear", "ammunition"].includes(item.category))
					.length,
				valuables: items.filter((item) => item.category === "valuable").length,
			});

			// Get 4 most recent items (using id as a proxy for recency)
			const sortedItems = [...items].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);
			setRecentItems(sortedItems);
			setIsLoading(false);
		}
	}, [items]);

	const StatCard = ({ title, value, icon: Icon, color = "text-blue-500" }: StatCardProps) => (
		<Card className="flex-1 transition-all hover:shadow-md">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-medium text-muted-foreground">
						{title}
					</CardTitle>
					<div className={`p-2 rounded-md bg-background`}>
						<Icon className={`w-5 h-5 ${color}`} />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className="h-8 w-1/2" />
				) : (
					<div className="text-2xl font-bold">{value}</div>
				)}
			</CardContent>
		</Card>
	);

	const QuickLink = ({
		title,
		description,
		icon: Icon,
		href,
		color = "text-blue-500",
	}: QuickLinkProps) => (
		<Link href={href}>
			<Card className="h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className={`p-2 rounded-md bg-opacity-10 ${color}`}>
							<Icon className="w-5 h-5 text-background" />
						</div>
						<ArrowRight className="w-4 h-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					<h3 className="text-lg font-semibold mb-1">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
				</CardContent>
			</Card>
		</Link>
	);

	return (
		<div className="container mx-auto p-4 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight sr-only">Dashboard</h1>
				<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				<p className="text-muted-foreground">
					{/* Insert some text here, goes under Dashboard text */}
				</p>
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
					<h2 className="text-xl font-semibold">Recently Added</h2>
					<Button
						variant="ghost"
						asChild
					>
						<Link
							href="/items"
							className="flex items-center gap-2"
						>
							View All <ArrowRight className="w-4 h-4" />
						</Link>
					</Button>
				</div>

				{isLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[...Array(4)].map((_, i) => (
							<ItemSkeleton key={i} />
						))}
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{recentItems.map((item) => (
							<ItemCard
								key={item.id}
								item={item}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardPage;
