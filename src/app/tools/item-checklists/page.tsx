import { WorkshopItemChecklist } from "@/components/checklist/wbItemChecklist";

export default function ChecklistPage() {
	return (
		<div className="flex flex-col gap-6 mx-auto w-full max-w-[1600px]">
			<h1 className="text-2xl text-center font-bold">Item Checklist Dashboard</h1>

			<WorkshopItemChecklist />
		</div>
	);
}
