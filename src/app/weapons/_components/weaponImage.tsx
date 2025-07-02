import { cn } from "@/lib/utils";
import Image from "next/image";

export function WeaponImage({
	name,
	className,
	rarity,
	showGradient = true,
	gradientClasses = "",
}: {
	name: string;
	className?: string;
	rarity: string;
	showGradient?: boolean;
	gradientClasses?: string;
}) {
	const getUrlName = (name: string) => {
		return name.replace(/ /g, "_");
	};

	return (
		<div
			className={cn(
				"rounded-lg relative overflow-hidden flex items-center justify-center",
				`border-2 border-${rarity}`,
				className
			)}
		>
			{showGradient && (
				<div
					className={cn(
						"absolute inset-0 z-0 pointer-events-none opacity-40",
						gradientClasses
					)}
					style={{
						background: `radial-gradient(circle at bottom right, var(--color-${rarity}) 0%, transparent 80%)`,
					}}
				></div>
			)}
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
