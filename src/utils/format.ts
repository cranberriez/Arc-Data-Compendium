export const formatSnakeCase = (str: string) =>
	str
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
