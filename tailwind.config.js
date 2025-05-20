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
		"text-uncommon",
		"text-rare",
		"text-epic",
		"text-legendary",
		"border-common",
		"border-uncommon",
		"border-rare",
		"border-epic",
		"border-legendary",
		"bg-common",
		"bg-uncommon",
		"bg-rare",
		"bg-epic",
		"bg-legendary",
		"bg-common/10",
		"bg-uncommon/10",
		"bg-rare/10",
		"bg-epic/10",
		"bg-legendary/10",
	],
	plugins: [],
};
