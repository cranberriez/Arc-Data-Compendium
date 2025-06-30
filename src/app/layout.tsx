import type { Metadata, Viewport } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppProviders } from "@/components/app-providers";
import { LayoutHeader } from "@/components/toolbar/layoutHeader";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

export const metadata: Metadata = {
	title: "ARCVault - ARC Raiders Companion & Data Vault",
	description:
		"Your ultimate resource for ARC Raiders with detailed item stats, recycle chains, quests, tracking, and more. Browse every item in the game and find out how to get it, what it's for, and how to use it. Track your progress and plan your next raid with ease. Create item checklists and see every item you will ahead of time in one place.",
	keywords: [
		"ARC Raiders vault",
		"ARC Raiders items",
		"ARC Raiders database",
		"ARC Raiders crafting guide",
		"weapon stats ARC Raiders",
		"quest walkthroughs",
		"gear progression",
		"recycle chains",
		"workbenches",
	],
	metadataBase: new URL("https://arcvault.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "ARCVault - ARC Raiders Companion & Data Vault",
		description:
			"Your ultimate resource for ARC Raiders with detailed item stats, recycle chains, quests, tracking, and more. Browse every item in the game and find out how to get it, what it's for, and how to use it. Track your progress and plan your next raid with ease. Create item checklists and see every item you will ahead of time in one place.",
		url: "https://arcvault.app",
		siteName: "ARCVault - ARC Raiders Companion & Data Vault",
		locale: "en_US",
		type: "website",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: true,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className="max-h-screen overflow-hidden">
				<AppProviders>
					<AppSidebar />
					<SidebarInset className="max-h-[calc(100vh-theme(spacing.4))]">
						<LayoutHeader />

						<div className="flex flex-col flex-1 h-full overflow-y-auto relative pt-12">
							{children}
						</div>
					</SidebarInset>
				</AppProviders>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
