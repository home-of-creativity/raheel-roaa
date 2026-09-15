import { existsSync, renameSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const middleware = join(root, "middleware.ts");
const skipped = join(root, "middleware.ts.pages-skip");
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://home-of-creativity.github.io/raheel-roaa";

if (existsSync(middleware)) {
  renameSync(middleware, skipped);
}

try {
  const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  if (existsSync(skipped)) {
    renameSync(skipped, middleware);
  }
}

const outDir = join(root, "out");
writeFileSync(join(outDir, ".nojekyll"), "");
writeFileSync(
  join(outDir, "index.html"),
  `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./ar/" />
    <link rel="canonical" href="${siteUrl}/ar/" />
    <title>رحيل ورؤى</title>
  </head>
  <body>
    <a href="./ar/">رحيل ورؤى</a>
  </body>
</html>
`,
);
writeFileSync(
  join(outDir, "404.html"),
  `<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./ar/" />
    <title>رحيل ورؤى</title>
  </head>
  <body>
    <a href="./ar/">رحيل ورؤى</a>
  </body>
</html>
`,
);
