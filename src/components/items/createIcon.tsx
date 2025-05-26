"use client";
import dynamic from "next/dynamic";
import { memo } from "react";
import * as LucideIcons from "lucide-react";

// Type for valid Lucide icon names
export type IconName = keyof typeof LucideIcons;

interface DynamicIconProps {
	name: IconName;
	className?: string;
	[key: string]: any;
}

const DynamicIcon = memo(({ name, className, ...props }: DynamicIconProps) => {
	// Convert the name to match Lucide's export format
	const formattedName = name as IconName;

	const IconComponent = LucideIcons[formattedName] as React.ComponentType<{ className?: string }>;

	if (!IconComponent) {
		console.warn(`Icon "${name}" not found in Lucide Icons`);
		return null;
	}

	return (
		<IconComponent
			className={className}
			{...props}
		/>
	);
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
