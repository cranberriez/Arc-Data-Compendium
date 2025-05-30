import { WorkshopProvider } from "@/contexts/workshopContext";

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full">
			<WorkshopProvider>
				<main className="flex-1 sm:p-6">{children}</main>
			</WorkshopProvider>
		</div>
	);
}
