import type { Metadata } from "next";
// import ThemeLayout from "@/components/ThemeLayout";
import { ThemeProvider } from "@/components/theme-provider";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolbarBreadcrumb } from "@/components/toolbar-breadcrumb";

import "./globals.css";

export const metadata: Metadata = {
	title: "ARC Data Compendium",
	description: "A comprehensive data compendium for ARC game items and gear",
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
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
				>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset className="max-h-[calc(100vh-theme(spacing.4))]">
							<header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
								<div className="flex items-center gap-2 px-4">
									<SidebarTrigger className="-ml-1 cursor-pointer" />
									<Separator
										orientation="vertical"
										className="mr-2 h-4"
									/>
									<ToolbarBreadcrumb />
								</div>
							</header>

							<ScrollArea className="flex-1 overflow-auto h-full relative">
								{children}
							</ScrollArea>
						</SidebarInset>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
