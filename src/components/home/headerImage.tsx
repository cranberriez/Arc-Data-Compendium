import { cn } from "@/lib/utils";
import Image from "next/image";

export function HeaderImage() {
	return (
		<Image
			src="/images/arc-raiders-homepage-optimized-1.webp"
			alt="ARC Raiders Gif of Raider gearing up and leaving Speranza"
			width={1600}
			height={400}
			className={cn("w-full h-full object-cover rounded-xl")}
			loading="eager"
			unoptimized
		/>
	);
}
