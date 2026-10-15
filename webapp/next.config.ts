import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/analyze", destination: "/check", permanent: false },
      { source: "/help", destination: "/guide", permanent: false },
      ...["/alerts", "/graph", "/reports", "/settings", "/admin", "/login"].map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
