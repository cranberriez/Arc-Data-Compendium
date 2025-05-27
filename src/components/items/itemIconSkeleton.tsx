import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type ItemIconSkeletonProps = {
	size?: "sm" | "md" | "lg" | "default";
	className?: string;
};

export function ItemIconSkeleton({ size = "default", className }: ItemIconSkeletonProps) {
	const sizeClasses = {
		sm: "h-10 w-10",
		md: "h-8 w-8",
		lg: "h-10 w-10",
		default: "h-14 w-14",
	};

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-md border-2 border-secondary/30 bg-secondary/5 p-2 min-w-[70px] min-h-[70px] sm:min-w-[90px] sm:min-h-[90px]",
				sizeClasses[size],
				className
			)}
		>
			<Skeleton className={cn("h-full w-full rounded-sm", sizeClasses[size])} />
		</div>
	);
}
