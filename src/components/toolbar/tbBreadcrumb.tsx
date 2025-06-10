"use client";

import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { formatSnakeCase } from "@/utils/format";

export default function ToolbarBreadcrumb() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean); // removes empty strings

	let pathSoFar = "";

	return (
		<div className="flex items-center justify-between gap-2 w-full">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink href="/">ARC Vault</BreadcrumbLink>
					</BreadcrumbItem>
					{segments.map((seg, idx) => {
						pathSoFar = `/${segments.slice(0, idx + 1).join("/")}`;
						const isLast = idx === segments.length - 1;
						const label = seg
							.replace(/-/g, " ")
							.replace(/\b\w/g, (c) => c.toUpperCase());
						const output = formatSnakeCase(label);

						return (
							<React.Fragment key={pathSoFar}>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									{isLast ? (
										<BreadcrumbPage>{output}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={pathSoFar}>{output}</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
