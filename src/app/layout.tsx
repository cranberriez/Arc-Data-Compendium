import type { Metadata, Viewport } from "next";
// import ThemeLayout from "@/components/ThemeLayout";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ToolbarBreadcrumb } from "@/components/toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppProviders } from "@/components/app-providers";

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
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "ARC Data Compendium",
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
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
							<div className="flex items-center gap-2 px-4 w-full">
								<SidebarTrigger className="-ml-1 cursor-pointer" />
								<Separator
									orientation="vertical"
									className="mr-2 h-4"
								/>
								<ToolbarBreadcrumb />
							</div>
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
