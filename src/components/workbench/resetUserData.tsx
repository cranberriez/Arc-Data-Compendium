"use client";

import { Button } from "@/components/ui/button";
import { useWorkbenchLevels } from "@/hooks/useUser";

export default function ResetUserData() {
	const { resetWorkbenches } = useWorkbenchLevels();

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
