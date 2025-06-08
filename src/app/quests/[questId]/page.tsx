import { fetchQuestById } from "@/services/dataService";
import { QuestItem } from "../components/questItem";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function QuestPage({ params }: { params: { questId: string } }) {
	const { questId } = await params;
	const questData = await fetchQuestById(questId);

	if (!questData) {
		return (
			<main className="mx-auto max-w-[1600px] mt-12">
				<div className="flex items-center space-x-2 mb-8">
					<Link href="/quests">
						<Button
							variant="outline"
							size="sm"
							className="cursor-pointer"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Quests
						</Button>
					</Link>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Quest not found</CardTitle>
						<CardDescription>The requested quest could not be found.</CardDescription>
					</CardHeader>
				</Card>
			</main>
		);
	}

	return (
		<main className="max-w-[1600px] mx-auto p-6">
			<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
			{questData && (
				<QuestItem
					quest={questData}
					key={questData.id}
				/>
			)}
		</main>
	);
}
