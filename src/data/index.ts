// Export the centralized JSON loader
export * from "./jsonLoader";

// Export original data sources for compatibility
export * from "./workbenches/workbenchData";
export * from "./items/itemData";
export * from "./recipes/recipeData";
export * from "./valuables/valuableData";

// Deprecated exports (kept for backward compatibility)
export { loadData as loadJsonData } from "./jsonLoader";
export { loadDataFromFile as loadJsonDataFromFile } from "./jsonLoader";
export type { DataMapper } from "./jsonLoader";
