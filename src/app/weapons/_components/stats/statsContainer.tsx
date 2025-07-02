import { Weapon } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function StatsContainer({ weapon }: { weapon: Weapon | null }) {
	if (!weapon) return null;

	return (
		<div className="w-full h-full flex flex-col gap-4 p-4">
			<div className="flex flex-row flex-wrap gap-2">
				<WeaponImage
					name={weapon.name}
					className="aspect-video w-lg"
					rarity={weapon.rarity}
				/>
				<BasicInfo
					name={weapon.name}
					description={weapon.description}
					rarity={weapon.rarity}
					ammoType={weapon.weapon?.ammoType!}
					className="w-lg"
				/>
			</div>
		</div>
	);
}

function BasicInfo({
	name,
	description,
	rarity,
	ammoType,
	className,
}: {
	name: string;
	description: string | null;
	rarity: string;
	ammoType: string;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-4 bg-card p-4 rounded-lg", className)}>
			<h2 className="text-3xl font-semibold tracking-wide"> {name} </h2>
			<p> {description ?? "No description"} </p>
		</div>
	);
}

function WeaponImage({
	name,
	className,
	rarity,
}: {
	name: string;
	className?: string;
	rarity: string;
}) {
	const getUrlName = (name: string) => {
		return name.replace(/ /g, "_");
	};

	return (
		<div
			className={cn(
				"bg-card rounded-lg p-2 relative overflow-hidden flex items-center justify-center",
				`border-2 border-${rarity}`,
				className
			)}
		>
			<div
				className="absolute inset-0 z-0 pointer-events-none opacity-40"
				style={{
					background: `radial-gradient(circle at bottom right, var(--color-${rarity}) 0%, transparent 80%)`,
				}}
			></div>
			<div className="w-full h-full relative z-10">
				<Image
					fill
					alt={`${name} Image`}
					src={`https://gkatpmmnctjyuskg.public.blob.vercel-storage.com/weapon-images/${getUrlName(
						name
					)}-Level1.webp`}
					className="object-contain"
				/>
			</div>
		</div>
	);
}
