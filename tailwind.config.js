/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class", // Enables toggling dark mode via class
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		"text-common",
		"bg-common",
		"border-common",
		"text-uncommon",
		"bg-uncommon",
		"border-uncommon",
		"text-rare",
		"bg-rare",
		"border-rare",
		"text-epic",
		"bg-epic",
		"border-epic",
		"text-legendary",
		"bg-legendary",
		"border-legendary",
	],
	plugins: [],
};
