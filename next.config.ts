import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...config.externals, "encoding"];
    }
    return config;
  },
};

export default nextConfig;
