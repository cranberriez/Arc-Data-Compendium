import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			// Disable the rule for the whole project
			"@typescript-eslint/no-explicit-any": "off",
			"no-unused-vars": "off", // base rule
			"@typescript-eslint/no-unused-vars": "off", // TS rule
		},
	},
];

export default eslintConfig;
