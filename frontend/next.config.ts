import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    output: "standalone",
    images: {
        remotePatterns: [
            {
                hostname: "megaphone.imgix.net",
            },
            {
                hostname: "static-cdn.sr.se",
            },
        ],
    },
};

export default nextConfig;
