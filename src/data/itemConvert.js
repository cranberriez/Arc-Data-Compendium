const fs = require("fs");
const path = require("path");

const sourceFile = "/workbenches/workbenchData.js";
const destinationFile = "/workbenches/workbenchData.json";

/**
 * Converts JavaScript item data to valid JSON by replacing Lucide icon references with string names
 */
function convertItemsToJson() {
	try {
		// Read the itemData.js file
		const itemDataPath = path.join(__dirname, sourceFile);
		const fileContent = fs.readFileSync(itemDataPath, "utf8");

		// Process the file line by line to handle icon references
		const lines = fileContent.split("\n");
		const jsonItems = [];
		let currentItem = null;
		let inItemBlock = false;

		// Skip the export line
		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();

			// Start of a new item
			if (line === "{") {
				currentItem = {};
				inItemBlock = true;
				continue;
			}

			// End of an item
			if (line === "}," || line === "}") {
				if (currentItem && inItemBlock) {
					jsonItems.push(currentItem);
					currentItem = null;
					inItemBlock = false;
				}
				continue;
			}

			// End of the array
			if (line === "];") {
				break;
			}

			// Process item properties
			if (inItemBlock && currentItem !== null) {
				// Skip empty lines
				if (!line) continue;

				// Handle property lines
				const propertyMatch = line.match(/^(\w+):\s*(.+?),?$/);
				if (propertyMatch) {
					const [, key, value] = propertyMatch;

					// Special handling for icon property
					if (key === "icon") {
						// Extract the icon name
						const iconName = value.trim();
						currentItem[key] = iconName; // Store icon name as string
					} else if (value === "null") {
						currentItem[key] = null;
					} else if (value.startsWith("[") && !value.endsWith("]")) {
						// Handle array that spans multiple lines (like recycling)
						let arrayContent = value;
						let j = i + 1;
						while (j < lines.length && !lines[j].trim().endsWith("],")) {
							arrayContent += " " + lines[j].trim();
							j++;
						}
						if (j < lines.length) {
							arrayContent += " " + lines[j].trim().replace(/],?$/, "]");
							i = j; // Skip processed lines
						}

						// Parse the array content
						try {
							// Replace single quotes with double quotes for JSON parsing
							const jsonArrayString = arrayContent.replace(/'/g, '"');
							currentItem[key] = JSON.parse(jsonArrayString);
						} catch (e) {
							console.warn(`Could not parse array for ${key}:`, arrayContent);
							currentItem[key] = arrayContent; // Store as string if parsing fails
						}
					} else if (!isNaN(Number(value))) {
						// Handle numeric values
						currentItem[key] = Number(value);
					} else if (value.startsWith('"') || value.startsWith("'")) {
						// Handle string values
						currentItem[key] = value.substring(
							1,
							value.length - (value.endsWith(",") ? 2 : 1)
						);
					} else {
						// Handle other values
						currentItem[key] = value.replace(/,$/, "");
					}
				}
			}
		}

		// Convert the processed items to JSON
		const jsonContent = JSON.stringify(jsonItems, null, 2);

		// Write to the JSON file
		const jsonFilePath = path.join(__dirname, destinationFile);
		fs.writeFileSync(jsonFilePath, jsonContent, "utf8");

		console.log(`✅ Successfully converted items to JSON at ${jsonFilePath}`);
		console.log(
			"Remember to create an itemLoader.ts file to handle icon mapping when importing this JSON."
		);
		return jsonItems;
	} catch (error) {
		console.error("❌ Error converting items to JSON:", error);
		return null;
	}
}

/**
 * Validates the generated JSON file
 */
function validateJsonFile() {
	try {
		const jsonFilePath = path.join(__dirname, destinationFile);
		const jsonContent = fs.readFileSync(jsonFilePath, "utf8");

		// Try parsing the JSON to validate it
		JSON.parse(jsonContent);
		console.log("✅ JSON validation successful!");
	} catch (error) {
		console.error("❌ JSON validation failed:", error);
		console.log("You may need to manually fix any remaining issues in the JSON file.");
	}
}

// Run the conversion
convertItemsToJson();
// Validate the result
validateJsonFile();

console.log("\nUsage instructions:");
console.log("1. Run this script with Node.js: node itemConvert.js");
console.log("2. Check the generated itemData.json file");
console.log("3. Create an itemLoader.ts file to map icon strings back to Lucide components");
