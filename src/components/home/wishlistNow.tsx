import { FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import Link from "next/link";
import { CountdownTimer } from "./countdown";

export function WishlistNow() {
	return (
		<div
			className="
                flex flex-wrap justify-between items-center gap-4
                rounded-lg p-6
                bg-gradient-to-l from-blue-200 to-blue-400
                dark:from-gray-900 dark:to-blue-900
            "
		>
			<CountdownTimer
				releaseDate={new Date(Date.UTC(2025, 9, 30, 20, 0, 0))}
				initialTimeLeft={{ total: 1000, days: 0, hours: 0, minutes: 0, seconds: 0 }}
			/>
			<div className="flex flex-col items-center gap-2 rounded p-2 bg-background/80 min-w-[287px]">
				<div className="flex items-center gap-2">
					<Link
						href="https://steamcommunity.com/sharedfiles/filedetails/?id=2962262566"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							backgroundColor: "#66c0f4", // Steam's light text color
							color: "black",
						}}
						className="flex items-center gap-2 rounded p-2"
					>
						<FaSteam size={24} />
						<p className="text-lg font-semibold tracking-wide">STEAM</p>
					</Link>
					<Link
						href="https://steamcommunity.com/sharedfiles/filedetails/?id=2962262566"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							backgroundColor: "#2F2D2E", // Steam's light text color
							color: "white",
						}}
						className="flex items-center gap-2 rounded p-2"
					>
						<SiEpicgames size={24} />
						<p className="text-lg font-semibold tracking-wide">EPIC GAMES</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
