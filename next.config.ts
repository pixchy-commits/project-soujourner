import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["tamer-agenda-effects.ngrok-free.dev"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
