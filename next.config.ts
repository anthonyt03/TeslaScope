import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-assets.tesla.com",
      },
      {
        protocol: "https",
        hostname: "digitalassets.tesla.com",
      },
    ],
  },
};

export default nextConfig;
