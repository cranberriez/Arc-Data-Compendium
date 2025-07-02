"use client";
import { useState, useEffect } from "react";

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
