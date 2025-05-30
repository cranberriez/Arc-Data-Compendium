import { fetchWorkbenchById } from "@/services/dataService";
import { WorkbenchClient } from "./components/WorkbenchClient";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WorkbenchPageProps {
	params: Promise<{
		workbenchId: string;
	}>;
}

export default async function WorkbenchPage({ params }: WorkbenchPageProps) {
	const { workbenchId } = await params;

	// Fetch workbench data based on the workbench param
	const workbench = await fetchWorkbenchById(workbenchId);

	// Handle not found case
	if (!workbench) {
		return (
			<div className="container mx-auto px-4 py-8 relative">
				<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/10 to-transparent -z-10 opacity-50"></div>
				<div className="flex items-center space-x-2 mb-8">
					<Link href="/workshop">
						<Button
							variant="outline"
							size="sm"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Workshop
						</Button>
					</Link>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Workbench not found</CardTitle>
						<CardDescription>
							The requested workbench could not be found.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	return (
		// Render the client component with the server-fetched data
		<WorkbenchClient workbench={workbench} />
	);
}
