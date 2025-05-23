import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// Uncomment to disallow specific paths
			// disallow: ['/private/', '/admin/'],
		},
		sitemap: "https://arcvault.app/sitemap.xml",
	};
}
