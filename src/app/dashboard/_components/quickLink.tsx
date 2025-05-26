import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickLink({
	title,
	description,
	icon: Icon,
	href,
	color = "bg-blue-500",
}: {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
	color?: string;
}) {
	return (
		<Link href={href}>
			<Card className="h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<div className={`p-2 rounded-md ${color}`}>
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
}
