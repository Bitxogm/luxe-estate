import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling Prisma client (it uses native binaries)
  serverExternalPackages: ["@prisma/client", "prisma"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
