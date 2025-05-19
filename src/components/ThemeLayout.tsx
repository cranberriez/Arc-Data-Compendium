"use client";

import { useEffect, useState, ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ThemeLayout({ children }: { children: ReactNode }) {
	// Always start with 'light' to match SSR output
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// On client, check system preference
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(prefersDark ? "dark" : "light");
	}, []);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.classList.remove("dark", "light");
		document.documentElement.classList.add(theme);
		console.log(`[ThemeLayout] Theme changed to:`, theme);
	}, [theme, mounted]);

	if (!mounted) {
		// Optionally, render nothing or a loading spinner until mounted
		return null;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Building Your Application
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Data Fetching</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);

	// return (
	//   <div className={`${inter.className} bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200`}>
	//     <div className="min-h-screen flex font-sans transition-colors duration-200">
	//       <SidebarNavigation theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
	//       <main className="flex-1 flex flex-col">
	//         {children}
	//       </main>
	//     </div>
	//   </div>
	// );
}
