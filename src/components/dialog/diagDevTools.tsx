import { Button } from "@/components/ui/button";
import { Item } from "@/types";
import { Braces } from "lucide-react";
import { formatDate } from "@/utils/format";

export default function DevTools({ item }: { item: Item }) {
	return (
		<div className="flex items-center w-full mt-4 gap-4">
			<Button
				variant="outline"
				className="cursor-pointer"
				onClick={() => console.log(item)}
			>
				<Braces />
				<span>Log Item</span>
			</Button>

			{item.createdAt && <p>Created: {formatDate(item.createdAt.toString())}</p>}
			{item.updatedAt && <p>Updated: {formatDate(item.updatedAt.toString())}</p>}
		</div>
	);
}
