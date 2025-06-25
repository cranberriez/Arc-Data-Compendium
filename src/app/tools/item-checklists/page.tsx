import { WorkshopItemChecklist } from "@/components/checklist/wbItemChecklist";

export default function ChecklistPage() {
	return (
		<div className="flex flex-col gap-6 mx-auto max-w-[1600px]">
			<h1 className="text-2xl text-center font-bold">Item Checklist</h1>
			<div className="flex gap-6">
				<WorkshopItemChecklist />
			</div>
		</div>
	);
}
