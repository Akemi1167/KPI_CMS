import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:1111/api";

const proxiedApiRoutes = [
  "health",
  "auth",
  "users",
  "kpi-periods",
  "kpi-event-types",
  "kpi-events",
  "kpi-results",
  "public",
] as const;

const nextConfig: NextConfig = {
  // Cursor / tunnel dev hosts may proxy HMR from non-localhost origins
  allowedDevOrigins: ["127.0.2.2", "127.0.0.1", "localhost"],
  async rewrites() {
    return {
      afterFiles: proxiedApiRoutes.flatMap((route) => [
        {
          source: `/api/${route}`,
          destination: `${apiProxyTarget}/${route}`,
        },
        {
          source: `/api/${route}/:path*`,
          destination: `${apiProxyTarget}/${route}/:path*`,
        },
      ]),
    };
  },
};

export default nextConfig;
