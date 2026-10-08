import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVG uploads are rejected server-side by magic-byte sniffing
    // (app/admin/real/actions.ts), so we do NOT allow the optimizer to
    // serve raw SVG either — no CSP backstop needed.
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tkevjdipmoberbxjggcv.supabase.co",
      },
    ],
  },
};

export default nextConfig;