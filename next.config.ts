import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["tamer-agenda-effects.ngrok-free.dev"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
