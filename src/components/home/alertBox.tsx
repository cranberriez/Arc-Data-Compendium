import { AlertCircleIcon } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export function AlertBox() {
	return (
		<div className="flex items-center gap-2 w-full pl-8 pr-2 py-2 border bg-yellow-500/10 text-yellow-500 rounded-2xl">
			<AlertCircleIcon />
			This Site is currently in development. Quests are missing, the weapons page has been
			disabled
			<span className="ml-auto text-blue-300 bg-card px-4 py-1 rounded-2xl ">
				<a
					href="https://discord.gg/uZfNEsrn5s"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2"
				>
					Join our Discord
					<FaDiscord className="w-4 h-4" />
				</a>
			</span>
		</div>
	);
}
