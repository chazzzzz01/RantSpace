import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config, { isServer }) {
    // Disable webpack persistent cache to prevent ENOSPC errors
    config.cache = false;
    return config;
  },
};

export default nextConfig;
