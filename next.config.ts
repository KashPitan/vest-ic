import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

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

export default withPayload(nextConfig);
