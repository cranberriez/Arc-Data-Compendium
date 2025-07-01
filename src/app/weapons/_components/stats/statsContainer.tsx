import { Weapon } from "@/types";
import Image from "next/image";

export function StatsContainer({ weapon }: { weapon: Weapon | null }) {
	if (!weapon) return null;

	const getUrlName = (name: string) => {
		return name.replace(/ /g, "_");
	};

	return (
		<div className="w-full h-full flex flex-col gap-4 p-4">
			<div className="w-full">
				<h2 className="text-2xl font-bold">{weapon.name}</h2>
			</div>
			<div className="bg-card rounded-lg w-full max-w-lg aspect-video p-2 relative overflow-hidden">
				<div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,theme(colors.primary.DEFAULT)_0%,transparent_80%)] pointer-events-none opacity-20"></div>
				<div className="w-full h-full relative z-10">
					<Image
						fill
						alt={`${weapon.name} Image`}
						src={`https://gkatpmmnctjyuskg.public.blob.vercel-storage.com/weapon-images/${getUrlName(
							weapon.name
						)}-Level1.webp`}
						className="object-cover"
					/>
				</div>
			</div>
		</div>
	);
}

//https://gkatpmmnctjyuskg.public.blob.vercel-storage.com/weapon-images/Anvil-Level1.webp
