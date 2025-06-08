import React from "react";
import QuestItemSkeleton from "../components/questItemSkeleton";

export default function Loading() {
	// Show 5 skeletons for a realistic loading effect
	return (
		<article className="w-full p-4">
			<div className="mx-auto max-w-[1200px]">
				<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
				<ul className="flex flex-col gap-2">
					{Array.from({ length: 1 }).map((_, i) => (
						<QuestItemSkeleton key={i} />
					))}
				</ul>
			</div>
		</article>
	);
}
