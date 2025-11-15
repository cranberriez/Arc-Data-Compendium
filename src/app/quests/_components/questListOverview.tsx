export default function QuestListOverview() {
	return null;
}

// "use client";

// import { useQuests } from "@/contexts/questContext";
// import ConfirmationButton from "@/components/confirmation-button";
// import { Button } from "@/components/ui/button";
// import { formatName } from "@/utils/format";
// import { useState, useEffect } from "react";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { useCookies } from "@/contexts/cookieContext";

// export function QuestListOverview({
// 	firstQuestId,
// 	totalQuests,
// }: {
// 	firstQuestId: string;
// 	totalQuests: number;
// }) {
// 	const { addActive, activeQuests, completedQuests, resetQuests } = useQuests();
// 	const { get, set } = useCookies();

// 	// State for UI preferences
// 	const [hideCompleted, setHideCompleted] = useState<boolean>(false);
// 	const [compactView, setCompactView] = useState<boolean>(false);

// 	// Load preferences from cookies
// 	useEffect(() => {
// 		const savedHideCompleted = get("stringValues", "hideCompletedQuests");
// 		const savedCompactView = get("stringValues", "questsCompactView");

// 		if (savedHideCompleted) setHideCompleted(savedHideCompleted === "true");
// 		if (savedCompactView) setCompactView(savedCompactView === "true");
// 	}, [get]);

// 	// Save preferences to cookies
// 	const handleHideCompletedChange = (checked: boolean) => {
// 		setHideCompleted(checked);
// 		set("stringValues", "hideCompletedQuests", checked.toString());
// 	};

// 	const handleCompactViewChange = (checked: boolean) => {
// 		setCompactView(checked);
// 		set("stringValues", "questsCompactView", checked.toString());
// 	};

// 	// Make these values available to parent components
// 	useEffect(() => {
// 		const event = new CustomEvent("questViewPreferencesChanged", {
// 			detail: { hideCompleted, compactView },
// 		});
// 		document.dispatchEvent(event);
// 	}, [hideCompleted, compactView]);

// 	return (
// 		<div className="w-full flex flex-wrap items-center gap-4 py-2 border-gray-800 mb-4">
// 			<div className="flex items-center gap-4">
// 				<h2 className="text-xl font-semibold">Quests</h2>

// 				<div className="flex items-center justify-center px-3 py-1 bg-gray-800 rounded-md">
// 					<span className="text-sm">
// 						{completedQuests.length} / {totalQuests}
// 					</span>
// 				</div>
// 			</div>

// 			<div className="flex items-center gap-6 ml-auto">
// 				<div className="flex items-center space-x-2">
// 					<Switch
// 						id="hide-completed"
// 						checked={hideCompleted}
// 						onCheckedChange={handleHideCompletedChange}
// 					/>
// 					<Label htmlFor="hide-completed">Hide Completed</Label>
// 				</div>

// 				<div className="flex items-center space-x-2">
// 					<Switch
// 						id="compact-view"
// 						checked={compactView}
// 						onCheckedChange={handleCompactViewChange}
// 					/>
// 					<Label htmlFor="compact-view">Compact View</Label>
// 				</div>

// 				<ConfirmationButton
// 					onClick={resetQuests}
// 					confirmText="Reset"
// 					cancelText="Cancel"
// 					title="Reset All Stored Quest Data?"
// 					description="This action cannot be undone and will reset quest data cookies to the defaults, removing any completed quests."
// 				>
// 					<Button
// 						variant="destructive"
// 						size="sm"
// 					>
// 						Reset Quests
// 					</Button>
// 				</ConfirmationButton>
// 			</div>
// 		</div>
// 	);
// }
