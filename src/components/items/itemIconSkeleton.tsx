import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type ItemIconSkeletonProps = {
	size?: "sm" | "md" | "lg" | "default";
	className?: string;
};

export function ItemIconSkeleton({ size = "default", className }: ItemIconSkeletonProps) {
	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-8 w-8",
		lg: "h-10 w-10",
		default: "h-8 w-8",
	};

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md border-2 border-secondary/30 bg-secondary/5 p-1",
				sizeClasses[size],
				className
			)}
		>
			<Skeleton className={cn("h-full w-full rounded-sm", sizeClasses[size])} />
		</div>
	);
}
