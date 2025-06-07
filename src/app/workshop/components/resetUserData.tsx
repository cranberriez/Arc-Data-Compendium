"use client";

import { Button } from "@/components/ui/button";
import { useWorkshop } from "@/contexts/workshopContext";

export default function ResetUserData() {
	const { resetWorkbenches } = useWorkshop();

	return (
		<Button
			variant="destructive"
			className="cursor-pointer"
			onClick={() => {
				resetWorkbenches();
			}}
		>
			Reset All Workbenches
		</Button>
	);
}
