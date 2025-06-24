"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function scrollToTopOfParent(element: HTMLElement | null) {
	let parent = element;
	while (parent) {
		const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
		const overflowYStyle = window.getComputedStyle(parent).overflowY;
		const isScrollable =
			hasScrollableContent && (overflowYStyle === "auto" || overflowYStyle === "scroll");
		if (isScrollable) {
			parent.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		parent = parent.parentElement;
	}
	// fallback
	window.scrollTo({ top: 0, behavior: "smooth" });
}

export function HomeFooter() {
	return (
		<footer className="p-4 flex flex-col items-center gap-6">
			<div className="flex lg:hidden justify-center">
				<Button
					variant="outline"
					className="cursor-pointer"
					onClick={(e) => {
						scrollToTopOfParent(e.currentTarget);
					}}
				>
					Top
				</Button>
			</div>
			<div className="flex flex-wrap max-w-[600px] w-full justify-between">
				<div className="flex flex-col gap-2">
					<Link
						href="/privacy"
						className="hover:underline"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms"
						className="hover:underline"
					>
						Terms of Service
					</Link>
					<Link
						href="/cookies"
						className="hover:underline"
					>
						Cookie Policy
					</Link>
				</div>
				<div className="hidden lg:flex justify-center">
					<Button
						variant="outline"
						className="cursor-pointer"
						onClick={(e) => {
							scrollToTopOfParent(e.currentTarget);
						}}
					>
						Top
					</Button>
				</div>
				<div className="flex flex-col gap-2">
					<Link
						href="mailto:official.arcvault@gmail.com"
						className="hover:underline flex items-center gap-2"
					>
						Contact Us
					</Link>
					<Link
						href="/about"
						className="hover:underline"
					>
						About Us
					</Link>
					<Link
						href="https://github.com/cranberriez/arc-data-compendium"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						Github
					</Link>
				</div>
			</div>
			<p className="text-center">© 2025 Arc Data Compendium. All rights reserved.</p>
		</footer>
	);
}
