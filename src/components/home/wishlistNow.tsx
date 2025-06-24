"use client";

import { useState, useEffect } from "react";

import { FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import Link from "next/link";

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

function getTimeRemaining(target: Date) {
	const now = new Date();
	const total = target.getTime() - now.getTime();
	if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
	const days = Math.floor(total / (1000 * 60 * 60 * 24));
	return { total, days, hours, minutes, seconds };
}

export function CountdownTimer({
	releaseDate,
	initialTimeLeft,
}: {
	releaseDate: Date;
	initialTimeLeft: ReturnType<typeof getTimeRemaining>;
}) {
	const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
	const released = timeLeft.total <= 0;

	useEffect(() => {
		if (released) {
			return;
		}
		const interval = setInterval(() => {
			const remaining = getTimeRemaining(releaseDate);
			setTimeLeft(remaining);
			if (remaining.total <= 0) {
				clearInterval(interval);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [releaseDate, released]);

	if (released) {
		return (
			<div>
				<h3 className="text-3xl font-semibold text-foreground">Play ARC Raiders Now!</h3>
			</div>
		);
	}

	return (
		<div>
			<p className="text-2xl font-mono">
				<span className="font-semibold">{timeLeft.days} Days</span> {timeLeft.hours}h{" "}
				{timeLeft.minutes}m{" "}
				{timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds}s{" "}
			</p>
			<h3 className="text-xl font-semibold text-foreground">Wishlist ARC Raiders Now!</h3>
		</div>
	);
}
