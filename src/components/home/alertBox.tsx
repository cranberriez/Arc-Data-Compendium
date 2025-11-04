import { AlertCircleIcon } from "lucide-react";

export function AlertBox() {
	return (
		<div className="flex items-center gap-2 w-full pl-8 pr-2 py-2 border bg-yellow-500/10 text-yellow-500 rounded-full">
			<AlertCircleIcon />
			This Site is currently in development. Items are missing, quests are incorrect,
			workbench requirements are old. Show your support by joining our Discord.
			<span className="ml-auto text-blue-500 bg-card px-4 py-1 rounded-full">
				<a href="https://discord.gg/7HJzeg3uBu" target="_blank" rel="noopener noreferrer">
					Join our Discord
				</a>
			</span>
		</div>
	);
}
