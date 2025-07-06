import { formatName } from "@/utils/format";
import { cn } from "@/lib/utils";

export function BasicInfo({
	name,
	description,
	rarity,
	ammoType,
	weaponClass,
	className,
}: {
	name: string;
	description: string | null;
	rarity: string;
	ammoType: string | null;
	weaponClass: string | null;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-4 bg-card p-4 rounded-lg", className)}>
			<h2 className="text-3xl font-semibold tracking-wide"> {name} </h2>
			<p> {description ?? "No description"} </p>
			<p> {weaponClass ? formatName(weaponClass) : "Unknown class"} </p>
		</div>
	);
}
