/** Prefix `/public` assets so they resolve under GitHub Pages `basePath`. */
export function publicAsset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }
  return `${base}${path}`;
}
