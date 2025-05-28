"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePageName } from "@/hooks/use-pagename";

export default function ToolbarBreadcrumb() {
	const pageTitle = usePageName();

	return (
		<div className="flex items-center justify-between gap-2 w-full">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink href="/">ARC Vault</BreadcrumbLink>
					</BreadcrumbItem>
					{pageTitle !== "" && (
						<>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
