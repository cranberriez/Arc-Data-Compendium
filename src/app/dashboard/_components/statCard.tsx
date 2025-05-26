import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: number;
	icon: React.ComponentType<{ className?: string }>;
	color?: string;
}

export function StatCard({ title, value, icon: Icon, color = "text-blue-500" }: StatCardProps) {
	return (
		<Card className="flex-1 transition-all hover:shadow-md">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-medium text-muted-foreground">
						{title}
					</CardTitle>
					<div className={`p-2 rounded-md bg-background`}>
						<Icon className={cn("w-5 h-5", color)} />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}
