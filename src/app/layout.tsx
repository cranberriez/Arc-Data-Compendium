import type { Metadata, Viewport } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppProviders } from "@/components/app-providers";
import Toolbar from "@/components/toolbar/toolbar";

import "./globals.css";

export const metadata: Metadata = {
	title: "ARC Data Compendium | Complete Item Database & Guides",
	description:
		"Your ultimate resource for ARC Raiders with detailed item stats, locations, and game data.",
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
		title: "ARC Data Compendium | Item & Stats Database",
		description:
			"Your ultimate resource for ARC Raiders with detailed item stats and recycle chains, quests, tracking, and more.",
		url: "https://arcvault.app",
		siteName: "ARC Data Compendium",
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
			<body>
				<AppProviders>
					<AppSidebar />
					<SidebarInset className="max-h-[calc(100vh-theme(spacing.4))]">
						<header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
							<Toolbar />
						</header>

						<ScrollArea className="flex-1 overflow-auto h-full mb-2 relative">
							{children}
						</ScrollArea>
					</SidebarInset>
				</AppProviders>
			</body>
		</html>
	);
}
