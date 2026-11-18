import type { NextConfig } from "next";

const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const host = baseUrl ? new URL(baseUrl) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      host
        ? {
            protocol: host.protocol.replace(":", "") as "http" | "https",
            hostname: host.hostname,
            port: host.port,
          }
        : { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
