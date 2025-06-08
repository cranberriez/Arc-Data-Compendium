"use client";

import { Quest } from "@/types/items/quest";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Image from "next/image";

function capitalizeId(id: string) {
	return id
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("_");
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
				<p className="text-sm text-muted-foreground mb-6">From ARC Raiders Wiki</p>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Main content */}
					<div className="flex-1">
						{/* Dialog */}
						{questData.dialog && (
							<section className="mb-6">
								<h2 className="text-xl font-semibold mb-2">Dialog</h2>
								<blockquote className="italic text-gray-400 bg-muted p-4 rounded">
									{questData.dialog}
								</blockquote>
							</section>
						)}

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
									: questData.location === ""
									? "Anywhere"
									: questData.location}
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
								>
									Official Wiki Page
								</Link>
							</Button>
						</div>
					</aside>
				</div>
			</div>
		</article>
	);
}
