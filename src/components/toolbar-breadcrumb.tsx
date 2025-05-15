"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function ToolbarBreadcrumb() {
	const pathname = usePathname();
	const path = pathname.split("/");
	const pageTitle = path[path.length - 1]
		.replace("-", " ")
		.replace("/", "")
		.replace(/^(.)/, (match) => match.toUpperCase());

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="hidden md:block">
					<BreadcrumbLink href="/">ARC Data</BreadcrumbLink>
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
	);
}
