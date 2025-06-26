"use client";

import { useState } from "react";
import { Button } from "./ui/button";

type Variants = "default" | "destructive" | "outline" | "secondary" | "ghost";
type Sizes = "default" | "sm" | "lg" | "icon";

export default function ConfirmationButton({
	children,
	onClick,
	confirmText,
	cancelText,
	variant,
	size,
	confirmVariant,
	cancelVariant,
	confirmSize,
	cancelSize,
}: {
	children: React.ReactNode;
	onClick: () => void;
	confirmText: string;
	cancelText: string;
	variant?: Variants;
	size?: Sizes;
	confirmVariant?: Variants;
	cancelVariant?: Variants;
	confirmSize?: Sizes;
	cancelSize?: Sizes;
}) {
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<div className="w-fit h-fit relative">
			<Button
				variant={variant}
				size={size}
				onClick={(e) => {
					e.stopPropagation();
					setShowConfirm(true);
				}}
				disabled={showConfirm}
				className={showConfirm ? "opacity-0!" : ""}
			>
				{children}
			</Button>

			{showConfirm && (
				<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
					<Button
						variant={confirmVariant}
						size={"icon"}
						onClick={(e) => {
							e.stopPropagation();
							onClick();
						}}
						className="w-1/2"
					>
						{confirmText}
					</Button>
					<Button
						variant={cancelVariant}
						size={"icon"}
						onClick={(e) => {
							e.stopPropagation();
							setShowConfirm(false);
						}}
						className="w-1/2"
					>
						{cancelText}
					</Button>
				</div>
			)}
		</div>
	);
}
