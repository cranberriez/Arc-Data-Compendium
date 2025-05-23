import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://arcvault.app",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		// Add more pages as needed, for example:
		{
			url: "https://arcvault.app/items",
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: "https://arcvault.app/workbenches",
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.6,
		},
	];
}
