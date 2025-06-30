import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        hostname: process.env.BLOB_HOST as string,
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
