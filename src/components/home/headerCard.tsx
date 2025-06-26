import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import { HeaderImage } from "./headerImage";

export function HeaderCard() {
	return (
		<div className="relative">
			<div className="w-full relative flex flex-col items-start justify-center gap-10 p-4 lg:p-8 py-10 lg:py-20 rounded-xl bg-gradient-to-r from-arcvault-primary-400/10 to-transparent bg-[length:200%_100%] bg-[position:0_0] z-10">
				<h1 className="text-6xl font-bold">ARC Vault</h1>
				<h2 className="text-lg lg:text-xl tracking-tight text-foreground/80 max-w-2xl">
					The ultimate data compendium and tracker for ARC Raiders. Explore items,
					weapons, armor, quests, recipes, and more.
				</h2>
				<div className="flex flex-wrap gap-2">
					<Button
						size="lg"
						className="p-3 px-6 h-auto w-auto font-semibold text-black hover:text-black bg-arcvault-primary-500 hover:bg-arcvault-primary-300"
						asChild
					>
						<Link href="/items">
							<Search className="w-4 h-4" />
							Explore Items
						</Link>
					</Button>
					{/* <Button
						size="lg"
						className="border-2 border-arcvault-primary-500 bg-background text-arcvault-primary-900 dark:text-arcvault-primary-500 hover:text-black hover:border-arcvault-primary-300 hover:bg-arcvault-primary-300 p-3 px-6 h-auto w-auto font-semibold "
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
				<HeaderImage />
			</div>
		</div>
	);
}
