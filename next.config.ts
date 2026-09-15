import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/raheel-roaa" : "";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : "standalone",
  trailingSlash: isGithubPages,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isGithubPages,
  },
};

export default withNextIntl(nextConfig);
