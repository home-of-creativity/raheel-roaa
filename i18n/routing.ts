import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: process.env.GITHUB_PAGES === "true" ? "always" : "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
