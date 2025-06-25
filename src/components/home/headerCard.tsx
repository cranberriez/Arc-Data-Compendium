import { Button } from "@/components/ui/button";
import { Info, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeaderCard() {
	return (
		<div className="relative">
			<div className="w-full relative flex flex-col items-start justify-center gap-10 p-4 lg:p-8 py-10 lg:py-20 rounded-xl bg-gradient-to-r from-arc-green-400/10 to-transparent bg-[length:200%_100%] bg-[position:0_0] z-10">
				<h1 className="text-6xl font-bold">ARC Vault</h1>
				<h2 className="text-lg lg:text-xl tracking-tight text-foreground/80 max-w-2xl">
					The ultimate data compendium and tracker for ARC Raiders. Explore items,
					weapons, armor, quests, recipes, and more.
				</h2>
				<div className="flex flex-wrap gap-2">
					<Button
						size="lg"
						className="p-3 px-6 h-auto w-auto font-semibold text-black hover:text-black bg-arc-green-500 hover:bg-arc-green-300"
						asChild
					>
						<Link href="/items">
							<Search className="w-4 h-4" />
							Explore Items
						</Link>
					</Button>
					{/* <Button
						size="lg"
						className="border-2 border-arc-green-500 bg-background text-arc-green-900 dark:text-arc-green-500 hover:text-black hover:border-arc-green-300 hover:bg-arc-green-300 p-3 px-6 h-auto w-auto font-semibold "
						asChild
					>
						<Link href="/about">
							<Info className="w-4 h-4" />
							About
						</Link>
					</Button> */}
				</div>
			</div>
			<div className="absolute top-0 left-0 w-full h-full z-0 opacity-50">
				<Image
					src="/images/arc-raiders-1-d56d47a693fa.gif"
					alt="ARC Raiders"
					width={1600}
					height={900}
					className="w-full h-full object-cover rounded-xl"
				/>
			</div>
		</div>
	);
}
