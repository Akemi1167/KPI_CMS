import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:1111/api";

const nextConfig: NextConfig = {
  // Cursor / tunnel dev hosts may proxy HMR from non-localhost origins
  allowedDevOrigins: ["127.0.2.2", "127.0.0.1", "localhost"],
  async rewrites() {
    return {
      afterFiles: [
        {
          // Keep /api/employee/* on Next.js BFF routes; proxy everything else to NestJS
          source: "/api/:path((?!employee(?:/|$)).*)",
          destination: `${apiProxyTarget}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
