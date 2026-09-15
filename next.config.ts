import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGithubPages ? "export" : "standalone",
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? "/raheel-roaa" : "",
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isGithubPages,
  },
};

export default withNextIntl(nextConfig);
