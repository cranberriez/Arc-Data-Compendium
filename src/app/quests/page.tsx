import React from "react";
import { fetchQuests } from "@/services/dataService";

export default async function QuestsPage() {
	const quests = await fetchQuests();

	return (
		<main className="max-w-[1600px] mx-auto p-6">
			<h1 className="text-2xl text-center font-bold mb-6">Quests</h1>
			{quests.length === 0 && <p>No quests found.</p>}
			<ul className="space-y-8">
				{quests.map((quest) => (
					<li
						key={quest.id}
						className="border rounded-lg p-4 shadow"
					>
						<h2 className="text-xl font-semibold mb-1">{quest.name}</h2>
						<p className="mb-1 text-gray-600">
							Trader: <span className="font-medium">{quest.trader}</span>
						</p>
						<p className="mb-2 text-gray-500 text-sm">
							Location:{" "}
							{Array.isArray(quest.location)
								? quest.location.join(", ")
								: quest.location}
						</p>
						{quest.dialog && (
							<blockquote className="italic text-gray-700 mb-2">
								"{quest.dialog}"
							</blockquote>
						)}

						<div className="mb-2">
							<strong>Requirements:</strong>
							<ul className="list-disc ml-6">
								{quest.requirements.map((req, i) => (
									<li key={i}>
										{req.description}
										{typeof req.count === "number" && (
											<span> x{req.count}</span>
										)}
										{req.links && req.links.length > 0 && (
											<span className="ml-2 text-xs text-blue-700">
												[
												{req.links.map((link, j) => {
													let key = `req-${i}-${j}-`;
													if (link.type === "wiki")
														key += `wiki-${link.url}`;
													else key += `${link.type}-${link.id}`;
													return (
														<React.Fragment key={key}>
															{j > 0 && (
																<span key={"sep-" + j}> | </span>
															)}
															{link.type === "item" && (
																<span
																	key={
																		"item-" + link.id + "-" + j
																	}
																>
																	item: {link.id}
																</span>
															)}
															{link.type === "enemy" && (
																<span
																	key={
																		"enemy-" + link.id + "-" + j
																	}
																>
																	enemy: {link.id}
																</span>
															)}
															{link.type === "location" && (
																<span
																	key={
																		"location-" +
																		link.id +
																		"-" +
																		j
																	}
																>
																	location: {link.id}
																</span>
															)}
															{link.type === "wiki" && (
																<a
																	key={
																		"wiki-" + link.url + "-" + j
																	}
																	href={link.url}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	wiki
																</a>
															)}
														</React.Fragment>
													);
												})}
												]
											</span>
										)}
									</li>
								))}
							</ul>
						</div>

						<div className="mb-2">
							<strong>Rewards:</strong>
							<ul className="list-disc ml-6">
								{quest.rewards.map((reward, i) => (
									<li key={i}>
										{reward.description}
										{typeof reward.count === "number" && (
											<span> x{reward.count}</span>
										)}
										{reward.links && reward.links.length > 0 && (
											<span className="ml-2 text-xs text-green-700">
												[
												{reward.links.map((link, j) => {
													let key = `reward-${i}-${j}-`;
													if (link.type === "wiki")
														key += `wiki-${link.url}`;
													else key += `${link.type}-${link.id}`;
													return (
														<React.Fragment key={key}>
															{j > 0 && (
																<span key={"sep-" + j}> | </span>
															)}
															{link.type === "item" && (
																<span
																	key={
																		"item-" + link.id + "-" + j
																	}
																>
																	item: {link.id}
																</span>
															)}
															{link.type === "enemy" && (
																<span
																	key={
																		"enemy-" + link.id + "-" + j
																	}
																>
																	enemy: {link.id}
																</span>
															)}
															{link.type === "location" && (
																<span
																	key={
																		"location-" +
																		link.id +
																		"-" +
																		j
																	}
																>
																	location: {link.id}
																</span>
															)}
															{link.type === "wiki" && (
																<a
																	key={
																		"wiki-" + link.url + "-" + j
																	}
																	href={link.url}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	wiki
																</a>
															)}
														</React.Fragment>
													);
												})}
												]
											</span>
										)}
									</li>
								))}
							</ul>
						</div>

						{quest.link && (
							<p>
								<a
									href={quest.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline"
								>
									Wiki page
								</a>
							</p>
						)}
					</li>
				))}
			</ul>
		</main>
	);
}
