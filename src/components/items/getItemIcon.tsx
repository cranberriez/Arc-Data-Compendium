import { cn } from "@/lib/utils";
import DynamicIcon from "./createIcon";
import { FileQuestion } from "lucide-react";
import type { IconName } from "./createIcon";

// Fallback to icon if no image found
export default function (iconName: string, className?: string) {
	const icon = iconName as IconName;
	if (icon) {
		// Convert icon string to LucideIcon component
		return (
			<DynamicIcon
				name={icon}
				className={className}
			/>
		);
	} else {
		return <FileQuestion className={className} />;
	}
}
