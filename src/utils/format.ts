export const formatSnakeCase = (str: string) =>
	str
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export const toRomanNumeral = (num: number) => {
	const map = [
		["X", 10],
		["V", 5],
		["I", 1],
	] as const;

	let roman = "";
	for (const [key, val] of map) {
		while (num >= val) {
			roman += key;
			num -= val;
		}
	}
	return roman;
};

export const formatDate = (dateString: string) => {
	return new Date(Date.parse(dateString)).toDateString() === new Date().toDateString()
		? new Intl.DateTimeFormat("en-US", {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
		  }).format(new Date(Date.parse(dateString)))
		: new Intl.DateTimeFormat("en-US").format(new Date(Date.parse(dateString)));
};
