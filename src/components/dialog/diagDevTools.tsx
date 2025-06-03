import { Button } from "@/components/ui/button";
import { Item } from "@/types";
import { Braces } from "lucide-react";

export default function DevTools({ item }: { item: Item }) {
	return (
		<div className="flex items-center w-full mt-4">
			<Button
				variant="outline"
				className="cursor-pointer"
				onClick={() => console.log(item)}
			>
				<Braces />
				<span>Log Item</span>
			</Button>
		</div>
	);
}
