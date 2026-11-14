import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["tamer-agenda-effects.ngrok-free.dev"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Only the Tailwind entry needs this loader. Matching *.module.css here
      // reclassifies CSS Modules as global CSS and loses their scoped exports.
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
