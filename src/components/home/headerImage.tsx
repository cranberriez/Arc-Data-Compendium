"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function HeaderImage() {
	const [imgLoaded, setImgLoaded] = useState(false);
	return (
		<img
			src="/images/arc-raiders-1-d56d47a693fa.gif"
			alt="ARC Raiders"
			width={1600}
			height={400}
			className={cn(
				"w-full h-full object-cover rounded-xl opacity-0 transition-opacity duration-500",
				imgLoaded ? "opacity-100" : "opacity-0"
			)}
			onLoad={() => setImgLoaded(true)}
			loading="lazy"
		/>
	);
}
