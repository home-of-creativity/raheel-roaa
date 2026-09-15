import { getRequestConfig } from "next-intl/server";
import { readFileSync } from "fs";
import { join } from "path";
import { routing } from "./routing";

function loadMessages(locale: string) {
  const filePath = join(process.cwd(), "messages", `${locale}.json`);
  const raw = readFileSync(filePath, "utf8").trim();
  if (!raw) {
    throw new Error(`Messages file is empty: ${filePath}`);
  }
  return JSON.parse(raw) as Record<string, unknown>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: loadMessages(locale),
  };
});
