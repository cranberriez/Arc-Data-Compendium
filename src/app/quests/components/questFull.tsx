"use client";

import { Quest } from "@/types/items/quest";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, MoveLeft, MoveRight } from "lucide-react";
import Image from "next/image";
import QuestFullSkeleton from "./questFullSkeleton";

function capitalizeId(id: string) {
	return id
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("_");
}

function formatName(id: string) {
	return capitalizeId(id).replaceAll("_", " ");
}

export function QuestFull({ questData }: { questData: Quest }) {
	const starterImg =
		"https://arcraiders.wiki/w/images/thumb/c/c6/Maps_Together.png/120px-Maps_Together.png.webp";
	const fullImg = "/images/quests/348px-Maps_Together.png-1.webp";

	return (
		<article className="w-full p-4">
			<div className="flex flex-col gap-4 mx-auto max-w-[1200px]">
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

				{/* Top image */}
				{/* relative is required when using a fill Image */}
				<div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
					<Image
						src={fullImg}
						alt={questData.name}
						className="object-cover"
						placeholder="blur"
						fill
						blurDataURL={starterImg}
						style={{ objectPosition: "top" }}
					/>
				</div>

				{/* Title and subtitle */}
				<h1 className="text-3xl font-bold mb-2">{questData.name}</h1>

				{/* Next and Previous 2*/}
				<div className="flex justify-between p-2">
					<div className="flex flex-col items-start gap-2">
						<h2 className="text-sm pl-2">Prerequisites</h2>
						{(questData.prereq ?? []).length > 0 ? (
							(questData.prereq ?? []).map((prereqId: string) => (
								<Link
									key={prereqId}
									href={`/quests/${prereqId}`}
								>
									<Button
										variant="outline"
										size="lg"
										className="border-blue-500/50! bg-blue-500/10! cursor-pointer relative group/questchange"
									>
										<MoveLeft className="w-4 h-4" />
										<span className="mb-[2px]">{formatName(prereqId)}</span>
										<div className="hidden group-hover/questchange:block absolute inset-0 w-full h-full animate-pulse bg-blue-500/20" />
									</Button>
								</Link>
							))
						) : (
							<p className="text-muted-foreground">No Prerequisites</p>
						)}
					</div>

					<div className="flex flex-col items-end gap-2">
						<h2 className="text-sm pr-2">Next Quests</h2>
						{(questData.next ?? []).length > 0 ? (
							(questData.next ?? []).map((nextId: string) => (
								<Link
									key={nextId}
									href={`/quests/${nextId}`}
								>
									<Button
										variant="outline"
										size="lg"
										className="border-blue-500/50! bg-blue-500/10! cursor-pointer relative group/questchange"
									>
										<span className="mb-[2px]">{formatName(nextId)}</span>
										<MoveRight className="w-4 h-4" />
										<div className="hidden group-hover/questchange:block absolute inset-0 w-full h-full animate-pulse bg-blue-500/20" />
									</Button>
								</Link>
							))
						) : (
							<p className="text-muted-foreground">No Next Quests</p>
						)}
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Main content */}
					<div className="flex-1">
						{/* Dialog */}
						<section className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Dialog</h2>
							<blockquote className="italic text-gray-400 bg-muted p-4 rounded">
								{questData.dialog
									? questData.dialog
									: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar nisl vel metus placerat, vel placerat nisl placerat."}
							</blockquote>
						</section>

						{/* Requirements */}
						<section className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Objectives</h2>
							<ul className="list-disc ml-6">
								{questData.requirements?.map((req, i) => (
									<li key={i}>{req.description}</li>
								))}
							</ul>
						</section>

						{/* Rewards */}
						<section>
							<h2 className="text-xl font-semibold mb-2">Rewards</h2>
							<ul className="list-disc ml-6">
								{questData.rewards?.map((reward, i) => (
									<li key={i}>
										{typeof reward.count === "number" && (
											<span>x{reward.count} </span>
										)}
										{reward.description}
									</li>
								))}
							</ul>
						</section>
					</div>

					{/* Sidebar */}
					<aside className="w-full md:w-64 flex-shrink-0">
						<div className="flex flex-col gap-4 bg-card p-4 rounded-lg shadow">
							<div>
								<strong>Trader:</strong> {questData.trader}
							</div>
							<div>
								<strong>Location:</strong>{" "}
								{Array.isArray(questData.location)
									? questData.location.join(", ")
									: "Anywhere"}
							</div>
							{/* Related quests, etc. */}
						</div>
						<div>
							<Button
								variant="link"
								className="flex items-center gap-2"
							>
								<ExternalLink className="w-4 h-4" />
								<Link
									href={
										questData.link ||
										`https://arcraiders.wiki/wiki/${capitalizeId(questData.id)}`
									}
									className="text-sm text-blue-500 dark:text-blue-300 hover:underline"
								>
									Official Wiki Page
								</Link>
							</Button>
						</div>
					</aside>
				</div>
				<p className="text-sm text-muted-foreground">
					Data Sourced From ARC Raiders{" "}
					<Link
						href="https://arcraiders.wiki/"
						className="text-sm text-muted-foreground hover:underline"
					>
						Official Wiki
					</Link>
				</p>
				<QuestFullSkeleton />
			</div>
		</article>
	);
}
