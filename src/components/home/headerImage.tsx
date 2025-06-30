"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function HeaderImage() {
	const [imgLoaded, setImgLoaded] = useState(false);
	return (
		<Image
			src="/images/arc-raiders-homepage-optimized-1.webp"
			alt="ARC Raiders Gif of Raider gearing up and leaving Speranza"
			width={1600}
			height={400}
			className={cn(
				"w-full h-full object-cover rounded-xl opacity-0 transition-opacity duration-500",
				imgLoaded ? "opacity-100" : "opacity-0"
			)}
			onLoad={() => setImgLoaded(true)}
			loading="eager"
		/>
	);
}
