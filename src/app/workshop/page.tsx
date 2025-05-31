import { fetchWorkbenches } from "@/services/dataService";
import Link from "next/link";

export default async function WorkshopOverview() {
	const workbenches = await fetchWorkbenches();

	return (
		<main className="w-full py-8">
			<div className="mx-auto max-w-6xl">
				<h1 className="text-2xl font-bold text-center mb-6">Workshop Overview</h1>
				<div className="flex flex-col gap-6">
					{workbenches.map((workbench) => (
						<div key={workbench.id}>
							<h2 className="text-xl font-semibold">{workbench.name}</h2>
							<p>{workbench.description}</p>
							<Link href={`/workshop/${workbench.id}`}>View Workbench</Link>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
