import { fetchWorkbenchById } from "@/services/dataService";

interface WorkbenchPageProps {
	params: Promise<{
		workbenchId: string;
	}>;
}

export default async function WorkbenchPage({ params }: WorkbenchPageProps) {
	const { workbenchId } = await params;

	// You can fetch workbench data here based on the workbench param
	const workbenchData = await fetchWorkbenchById(workbenchId);
	if (!workbenchData) {
		// Handle not found case
		return (
			<div>
				<h1>Workbench not found</h1>
			</div>
		);
	}

	return (
		<div>
			<h1>{workbenchData.name}</h1>
			{/* Workbench content */}
		</div>
	);
}
