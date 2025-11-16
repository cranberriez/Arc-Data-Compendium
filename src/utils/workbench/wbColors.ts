export const workbenchColors: Record<
	string,
	{ bg: string; shadow: string; border: string; gradient: string; iconColor: string }
> = {
	workbench: {
		bg: "bg-slate-200 dark:bg-slate-700",
		shadow: "rgba(100, 116, 139, 0.3)",
		gradient:
			"bg-gradient-to-r from-slate-300/40 to-transparent dark:from-slate-600/40 dark:to-transparent",
		border: "border-slate-300 dark:border-slate-600",
		iconColor: "text-slate-900 dark:text-slate-100",
	},
	gunsmith: {
		bg: "bg-indigo-200 dark:bg-indigo-700",
		shadow: "rgba(79, 70, 229, 0.3)",
		gradient:
			"bg-gradient-to-r from-indigo-300/40 to-transparent dark:from-indigo-600/40 dark:to-transparent",
		border: "border-indigo-300 dark:border-indigo-600",
		iconColor: "text-indigo-900 dark:text-indigo-100",
	},
	gear_bench: {
		bg: "bg-orange-200 dark:bg-orange-700",
		shadow: "rgba(234, 88, 12, 0.3)",
		gradient:
			"bg-gradient-to-r from-orange-300/40 to-transparent dark:from-orange-600/40 dark:to-transparent",
		border: "border-orange-300 dark:border-orange-600",
		iconColor: "text-orange-900 dark:text-orange-100",
	},
	medical_lab: {
		bg: "bg-emerald-200 dark:bg-emerald-700",
		shadow: "rgba(5, 150, 105, 0.3)",
		gradient:
			"bg-gradient-to-r from-emerald-300/40 to-transparent dark:from-emerald-600/40 dark:to-transparent",
		border: "border-emerald-300 dark:border-emerald-600",
		iconColor: "text-emerald-900 dark:text-emerald-100",
	},
	explosives_station: {
		bg: "bg-amber-200 dark:bg-amber-700",
		shadow: "rgba(217, 119, 6, 0.3)",
		gradient:
			"bg-gradient-to-r from-amber-300/40 to-transparent dark:from-amber-600/40 dark:to-transparent",
		border: "border-amber-300 dark:border-amber-600",
		iconColor: "text-amber-900 dark:text-amber-100",
	},
	utility_station: {
		bg: "bg-fuchsia-200 dark:bg-fuchsia-700",
		shadow: "rgba(192, 38, 211, 0.3)",
		gradient:
			"bg-gradient-to-r from-fuchsia-300/40 to-transparent dark:from-fuchsia-600/40 dark:to-transparent",
		border: "border-fuchsia-300 dark:border-fuchsia-600",
		iconColor: "text-fuchsia-900 dark:text-fuchsia-100",
	},
	scrappy: {
		bg: "bg-yellow-200 dark:bg-yellow-700",
		shadow: "rgba(202, 138, 4, 0.3)",
		gradient:
			"bg-gradient-to-r from-yellow-300/40 to-transparent dark:from-yellow-600/40 dark:to-transparent",
		border: "border-yellow-300 dark:border-yellow-600",
		iconColor: "text-yellow-900 dark:text-yellow-100",
	},
	refiner: {
		bg: "bg-cyan-200 dark:bg-cyan-700",
		shadow: "rgba(8, 145, 178, 0.3)",
		gradient:
			"bg-gradient-to-r from-cyan-300/40 to-transparent dark:from-cyan-600/40 dark:to-transparent",
		border: "border-cyan-300 dark:border-cyan-600",
		iconColor: "text-cyan-900 dark:text-cyan-100",
	},
	default: {
		bg: "bg-blue-200 dark:bg-blue-700",
		shadow: "rgba(59, 130, 246, 0.3)",
		gradient:
			"bg-gradient-to-r from-blue-300/40 to-transparent dark:from-blue-600/40 dark:to-transparent",
		border: "border-blue-300 dark:border-blue-600",
		iconColor: "text-blue-900 dark:text-blue-100",
	},
};

export const getWbColorObject = (wbId: string) => {
	if (wbId in workbenchColors) {
		return workbenchColors[wbId];
	}
	return workbenchColors.default;
};
