import { fetchQuestById, fetchQuestIds } from "@/services/dataService.server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { QuestFull } from "../_components/questFull";

export async function generateStaticParams() {
	const questIds = await fetchQuestIds();
	return questIds.map((id) => ({ questId: id }));
}

interface QuestPageProps {
	params: Promise<{
		questId: string;
	}>;
}

export default async function QuestPage({ params }: QuestPageProps) {
	const questData = await fetchQuestById((await params).questId);

	if (!questData) {
		return (
			<article className="w-full p-4">
				<div className="mx-auto max-w-[1600px]">
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
							<CardDescription>
								The requested quest could not be found.
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</article>
		);
	}

	return <QuestFull questData={questData} />;
}
