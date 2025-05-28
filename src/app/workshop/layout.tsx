export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full">
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
}
