interface WorkbenchPageProps {
	params: {
		workbenchId: string;
	};
}

export default async function WorkbenchPage({ params }: WorkbenchPageProps) {
	const { workbenchId } = await params;

	// You can fetch workbench data here based on the workbench param
	// const workbenchData = await getWorkbenchData(workbench)

	return (
		<div>
			<h1>{workbenchId.charAt(0).toUpperCase() + workbenchId.slice(1)} Workbench</h1>
			{/* Workbench content */}
		</div>
	);
}
