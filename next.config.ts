import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "gkatpmmnctjyuskg.public.blob.vercel-storage.com",
				protocol: "https",
			},
		],
	},
};

export default nextConfig;
